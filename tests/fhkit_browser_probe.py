"""Renders the built public/ in Chromium the way a visitor gets it from
Cloudflare Pages, and prints what the browser saw as JSON.

Run by fhkit-browser.ipynb as a subprocess, because the notebook's kernel
already runs an asyncio loop and Playwright's sync API refuses to start inside
one. Usage: python3 fhkit_browser_probe.py <site dir>

It serves public/ itself, with the Pages rules the checks depend on: the
nearest 404.html answers an unknown address with status 404, a directory
without its slash is redirected, and _redirects rewrites apply. The port is the
first free one from 9351 on, and the server stops with the probe.

Nothing leaves the machine. Every request to another host is aborted and
recorded: the notebook checks that the site asks for nothing but the partner
photos on osg.snek.at, and that the sign-in link reaches for
accounts.netsnek.com without anything being sent there. The contact form's
POST to emailwerk is written down and then answered inside the browser
(aborted, refused, failed or accepted), so pressing Send sends no mail.
Chromium is the system one (this machine is aarch64, Playwright ships no build
for it), with a throwaway profile and background networking off.
"""

import http.server
import json
import os
import re
import shutil
import socket
import sys
import threading
import time
import urllib.parse
from pathlib import Path

from playwright.sync_api import sync_playwright

SITE = Path(sys.argv[1]).resolve()
PUBLIC = (SITE / 'public').resolve()
LOCALES = {'de': '', 'en': 'en/', 'sl': 'sl/', 'it': 'it/', 'ja': 'ja/'}
SIGN_IN = {'de': 'Anmelden', 'en': 'Sign in', 'sl': 'Prijava', 'it': 'Accedi', 'ja': 'ログイン'}
CONTACT = {'de': 'Jetzt anfragen', 'en': 'Get in touch', 'sl': 'Pišite nam', 'it': 'Richiedi ora',
           'ja': 'お問い合わせはこちら'}
# The hero's button, which phones show where the bar has no room for CONTACT.
CONTACT_ME = {'de': 'Kontaktiere mich', 'en': 'Contact me', 'sl': 'Kontaktiraj me', 'it': 'Contattami',
              'ja': 'お問い合わせ'}
CLOSE = {'de': 'Schließen', 'en': 'Close', 'sl': 'Zapri', 'it': 'Chiudi', 'ja': '閉じる'}

EMAILWERK = 'https://emailwerk.com/graphql'
# What the probe types into the contact form. The address is on a domain
# reserved for examples, and nothing typed here leaves the machine.
FORM = {'firstName': 'Erika', 'lastName': 'Musterfrau', 'email': 'erika.musterfrau@example.org',
        'phone': '+43 1 234 56 78', 'message': 'Zeile eins\nZeile <b>zwei</b>'}
# How emailwerk answers, as the probe plays it, with status, type and body: a
# refusal is an error with a code, an accepted send is the queued message.
# The 'unauthorized' answer is what emailwerk's own auth gives a request it
# will not run without credentials, and 'fail' is the server failing. Both
# carry the CORS header, as emailwerk's answers to an allowed origin do, so the
# page can read the status.
ANSWER = {
    'refuse': (200, 'application/json', json.dumps(
        {'data': None, 'errors': [{'message': 'Zu viele Anfragen.',
                                   'extensions': {'code': 'PUBLIC_SEND_RATE_LIMITED'}}]})),
    'accept': (200, 'application/json', json.dumps(
        {'data': {'sendTemplateMail': {'__typename': 'Message', 'id': 'probe', 'status': 'QUEUED'}}})),
    'unauthorized': (401, 'text/plain; charset=UTF-8', 'Unauthorized'),
    'fail': (500, 'application/json', json.dumps({'errors': [{'message': 'Unexpected error.'}]})),
}

CHROMIUM = next((c for c in ['/usr/bin/chromium-browser', '/usr/bin/chromium', '/usr/bin/google-chrome']
                 if Path(c).exists()), None) or shutil.which('chromium') or shutil.which('chromium-browser')


# --- Cloudflare Pages, as far as the checks need it ------------------------

def load_rules():
    rules, path = [], PUBLIC / '_redirects'
    if not path.is_file():
        return rules
    for line in path.read_text(encoding='utf8').splitlines():
        parts = line.split()
        if len(parts) < 2 or line.lstrip().startswith('#'):
            continue
        rx = '^' + '/'.join('(?P<%s>[^/]+)' % s[1:] if s.startswith(':') else
                            ('(?P<splat>.*)' if s == '*' else re.escape(s))
                            for s in parts[0].split('/')) + '$'
        rules.append((re.compile(rx), parts[1], int(parts[2]) if len(parts) > 2 else 302))
    return rules


RULES = load_rules()


def inside(url_path):
    p = os.path.realpath(PUBLIC / url_path.lstrip('/'))
    return p if p == str(PUBLIC) or p.startswith(str(PUBLIC) + os.sep) else None


class Pages(http.server.BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    head = False

    def send(self, path, status):
        data = Path(path).read_bytes()
        ctype = {'.html': 'text/html; charset=utf-8', '.js': 'application/javascript',
                 '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml',
                 '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
                 '.xml': 'application/xml', '.txt': 'text/plain', '.woff2': 'font/woff2'}.get(
                     Path(path).suffix, 'application/octet-stream')
        self.send_response(status)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        if not self.head:
            self.wfile.write(data)

    def redirect(self, location):
        self.send_response(308)
        self.send_header('Location', location)
        self.send_header('Content-Length', '0')
        self.end_headers()

    def resolve(self, url_path):
        p = inside(url_path)
        if p is None or url_path in ('/_headers', '/_redirects'):
            return None
        if url_path.endswith('/'):
            return ('file', os.path.join(p, 'index.html')) if os.path.isfile(os.path.join(p, 'index.html')) else None
        if os.path.isfile(p):
            return ('file', p)
        if os.path.isfile(os.path.join(p, 'index.html')):
            return ('redirect', url_path + '/')
        return ('file', p + '.html') if os.path.isfile(p + '.html') else None

    def do_GET(self):
        parsed = urllib.parse.urlsplit(self.path)
        url_path = urllib.parse.unquote(parsed.path) or '/'
        for rx, target, status in RULES:
            m = rx.match(url_path)
            if m and status == 200:
                for name, value in m.groupdict().items():
                    target = target.replace(':' + name, value or '')
                hit = self.resolve(target)
                if hit and hit[0] == 'file':
                    return self.send(hit[1], 200)
        hit = self.resolve(url_path)
        if hit and hit[0] == 'redirect':
            return self.redirect(hit[1] + (('?' + parsed.query) if parsed.query else ''))
        if hit:
            return self.send(hit[1], 200)
        # The nearest 404.html, walking up from the address.
        d = url_path if url_path.endswith('/') else os.path.dirname(url_path)
        while True:
            cand = inside(d.rstrip('/') + '/404.html')
            if cand and os.path.isfile(cand):
                return self.send(cand, 404)
            if d in ('', '/'):
                break
            d = os.path.dirname(d.rstrip('/'))
        return self.send(PUBLIC / 'index.html', 200)  # Pages' SPA fallback

    def do_HEAD(self):
        # Gatsby asks with HEAD whether an address it has no page data for
        # exists at all.
        self.head = True
        self.do_GET()


def serve():
    for port in range(9351, 9400):
        with socket.socket() as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                break
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', port), Pages)
    srv.daemon_threads = True
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f'http://127.0.0.1:{port}'


# --- What the browser sees ---------------------------------------------------

# Contrast of every visible text and of every icon in a link or button against
# the backgrounds behind it, composited from the outside in, with the opacity
# of the element and its ancestors applied. Text over a background image is
# reported but not judged. Colours go through a canvas so that every CSS colour
# syntax resolves to sRGB.
CONTRAST_JS = r"""
() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', {willReadFrequently: true});
  const rgba = c => {
    if (!c || c === 'transparent') return [0, 0, 0, 0];
    cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255];
  };
  const over = (t, b) => [0, 1, 2].map(k => t[k] * t[3] + b[k] * (1 - t[3])).concat([1]);
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
                     return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const html = rgba(getComputedStyle(document.documentElement).backgroundColor);
  const canvas = html[3] > 0 ? over(html, [255, 255, 255, 1]) : [255, 255, 255, 1];
  const visible = el => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility !== 'visible' || parseFloat(cs.opacity) === 0) return false;
    }
    return !el.closest('[data-jaen-cc-banner], [aria-hidden="true"]');
  };
  const out = [];
  // An icon is judged by its own colour, which is what its currentColor
  // fill resolves to, and named after the link or button around it.
  const judge = (el, kind, named) => {
    if (!visible(el)) return;
    const chain = []; let image = false; let opacity = 1;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage !== 'none') image = true;
      chain.push(rgba(cs.backgroundColor)); opacity *= parseFloat(cs.opacity);
    }
    let bg = canvas;
    for (let k = chain.length - 1; k >= 0; k--) if (chain[k][3] > 0) bg = over(chain[k], bg);
    const fg = rgba(getComputedStyle(el).color);
    const shown = over([fg[0], fg[1], fg[2], fg[3] * opacity], bg);
    const text = (named.getAttribute('aria-label') || named.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    out.push({kind, text, nav: Boolean(el.closest('nav')), ratio: Math.round(ratio(shown, bg) * 100) / 100, image});
  };
  for (const el of document.querySelectorAll('body *')) {
    if (el.tagName.toLowerCase() === 'svg') { const link = el.closest('a, button'); if (link) judge(el, 'icon', link); continue; }
    if (el.closest('svg') || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME'].includes(el.tagName)) continue;
    if ([...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) judge(el, 'text', el);
  }
  return out;
}
"""

SCROLL_JS = """async () => {
  for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80));
  }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 300));
}"""

PAGE_JS = """() => ({
  lang: document.documentElement.lang, title: document.title, dark: document.documentElement.classList.contains('dark'),
  path: location.pathname, height: document.documentElement.scrollHeight,
  sideways: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  robots: (document.querySelector('meta[name=robots]') || {}).content || null,
  h1: (document.querySelector('h1') || {}).textContent || null,
  images: [...document.images].map(i => ({src: i.currentSrc || i.src, broken: i.complete && i.naturalWidth === 0,
                                         shown: getComputedStyle(i).display !== 'none'})),
})"""


# The contact dialog as the visitor sees it after Send: the notice that tells
# how the send went, whether it holds the focus, where it sits next to jaen's
# cookie banner, what the fields still hold and which buttons are labelled.
DIALOG_JS = """() => {
  const dialog = [...document.querySelectorAll('[role=dialog]')]
    .find(d => d.querySelector('#firstName, [role=status]'));
  if (!dialog) return null;
  const notice = dialog.querySelector('[role=alert], [role=status]');
  const box = e => { const r = e.getBoundingClientRect(); return {top: Math.round(r.top), bottom: Math.round(r.bottom)}; };
  const banner = document.querySelector('[data-jaen-cc-banner] #cm');
  return {
    notice: notice && {role: notice.getAttribute('role'), text: notice.innerText.replace(/\\s+/g, ' ').trim(),
                       mailto: (notice.querySelector('a[href^="mailto:"]') || {}).href || null,
                       focused: notice === document.activeElement, box: box(notice)},
    banner: banner && banner.getBoundingClientRect().height > 0 ? box(banner) : null,
    fields: Object.fromEntries(['firstName', 'lastName', 'email', 'phone', 'message']
      .map(i => [i, dialog.querySelector('#' + i) ? dialog.querySelector('#' + i).value : null])),
    buttons: [...dialog.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean),
  };
}"""


def attempt(step, entry, name):
    """Run one interaction, and record instead of raising if it fails: a
    regression should show up as failed checks, not as a probe that died."""
    try:
        return step()
    except Exception as e:  # noqa: BLE001
        entry.setdefault('probe_errors', []).append(f'{name}: {str(e).splitlines()[0][:200]}')
        return None


def main():
    srv, base = serve()
    sitemap = (PUBLIC / 'sitemap.xml').read_text(encoding='utf8')
    paths = sorted(re.sub(r'^https://fhkit\.at', '', l) for l in re.findall(r'<loc>([^<]+)</loc>', sitemap))
    out = {'base': base, 'pages': [], 'not_found': [], 'sign_in': {}, 'drawer': {}, 'maps': {}, 'cards': {},
           'contact': []}

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM, headless=True, args=[
            '--disable-background-networking', '--disable-sync', '--disable-component-update',
            '--no-first-run', '--no-default-browser-check', '--mute-audio'])

        def context(width=1440, mobile=False, dark=False, emailwerk=None):
            ctx = browser.new_context(viewport={'width': 390 if mobile else width, 'height': 844 if mobile else 1000},
                                      is_mobile=mobile, has_touch=mobile, device_scale_factor=1,
                                      color_scheme='dark' if dark else 'light', locale='de-AT')
            if dark:
                # jaen keeps the colour mode in localStorage; this is what the
                # CMS frame's switch writes.
                ctx.add_init_script("try{localStorage.setItem('theme','dark')}catch(e){}")
            outside = []

            def route(r):
                if urllib.parse.urlsplit(r.request.url).netloc == base.split('//')[1]:
                    r.continue_()
                elif emailwerk and r.request.url.startswith(EMAILWERK):
                    emailwerk(r)
                else:
                    outside.append(r.request.url)
                    r.abort()

            ctx.route('**/*', route)
            return ctx, outside

        def opened(ctx, path):
            page = ctx.new_page()
            errors, statuses = [], []
            # With the address the message came from: an aborted outside
            # request is reported as "Failed to load resource" and nothing else.
            page.on('console', lambda m: errors.append({'kind': 'console', 'text': m.text,
                                                        'url': (m.location or {}).get('url', '')})
                    if m.type == 'error' else None)
            page.on('pageerror', lambda e: errors.append({'kind': 'exception', 'text': str(e), 'url': ''}))
            page.on('response', lambda r: statuses.append((r.status, r.url)))
            resp = page.goto(base + path, wait_until='networkidle', timeout=90000)
            page.wait_for_timeout(1000)
            return page, resp.status if resp else None, errors, statuses

        # Every page of the sitemap, desktop and phone, light and dark.
        for path in paths:
            for mobile in (False, True):
                for dark in (False, True):
                    ctx, outside = context(mobile=mobile, dark=dark)
                    page, status, errors, statuses = opened(ctx, path)
                    page.evaluate(SCROLL_JS)
                    info = page.evaluate(PAGE_JS)
                    contrast = page.evaluate(CONTRAST_JS)
                    out['pages'].append({
                        'path': path, 'viewport': 'phone' if mobile else 'desktop', 'mode': 'dark' if dark else 'light',
                        'status': status, **info, 'errors': errors,
                        # Aborted outside requests surface as console errors and
                        # failed images; both are judged separately.
                        'bad_responses': [f'{s} {u}' for s, u in statuses if s >= 400],
                        'outside': sorted(set(outside)),
                        'low_contrast': sorted([c for c in contrast if c['ratio'] < 3 and not c['image']],
                                               key=lambda c: c['ratio']),
                        'contrast': contrast,
                    })
                    ctx.close()

        # Unknown addresses, in each language and on the removed sections.
        for loc, path, dark in [('de', '/gibt-es-nicht/', False), ('de', '/docs/', True), ('en', '/en/whatever', False),
                                ('en', '/en/experiments/', True), ('sl', '/sl/nic/', False),
                                ('it', '/it/niente/', False), ('ja', '/ja/foo/bar', True)]:
            ctx, outside = context(dark=dark)
            page, status, errors, statuses = opened(ctx, path)
            info = page.evaluate(PAGE_JS)
            home = page.evaluate("() => { const a = document.querySelector('main a[href]'); return a && a.getAttribute('href'); }")
            out['not_found'].append({'locale': loc, 'address': path, 'mode': 'dark' if dark else 'light',
                                     'status': status, **info, 'home_link': home, 'errors': errors,
                                     'outside': sorted(set(outside)),
                                     'bad_responses': [f'{s} {u}' for s, u in statuses if s >= 400]})
            ctx.close()

        # Sign in from the bar of each locale's legal notice.
        for loc, pre in LOCALES.items():
            ctx, outside = context()
            page, status, errors, _ = opened(ctx, f'/{pre}imprint/')
            link = page.locator('nav a', has_text=SIGN_IN[loc]).first
            entry = {}
            entry['href'] = attempt(lambda: link.get_attribute('href', timeout=5000), entry, 'find the link')
            entry['target'] = attempt(lambda: link.get_attribute('target', timeout=5000), entry, 'find the link')
            before = len(errors)

            def click():
                with page.expect_navigation(timeout=10000):
                    link.click(timeout=5000)

            attempt(click, entry, 'click')
            page.wait_for_timeout(2500)
            # What jaen's own sign-in page logs after the click is kept apart:
            # its footer links pages this site does not have.
            entry.update({'url_after': page.url.replace(base, ''), 'errors': errors[:before],
                          'after': errors[before:],
                          'accounts_netsnek': any('accounts.netsnek.com' in u for u in outside)})
            out['sign_in'][loc] = entry
            ctx.close()

        # The phone menu: its entries, and its sign-in.
        for loc in ('de', 'ja'):
            for dark in (False, True):
                ctx, outside = context(mobile=True, dark=dark)
                page, status, errors, _ = opened(ctx, f'/{LOCALES[loc]}imprint/')
                button = page.locator('nav button[aria-expanded]').first
                entry = {}
                entry['label'] = attempt(lambda: button.get_attribute('aria-label', timeout=5000), entry, 'menu button')
                attempt(lambda: button.click(timeout=5000), entry, 'open the menu')
                page.wait_for_timeout(900)
                entry['expanded'] = attempt(lambda: button.get_attribute('aria-expanded', timeout=5000), entry,
                                            'menu button')
                entry['items'] = page.evaluate("""() => [...document.querySelectorAll('nav + div a')]
                    .filter(a => a.getBoundingClientRect().height > 0)
                    .map(a => [a.textContent.trim(), a.getAttribute('href')])""")
                entry['contrast'] = [c for c in page.evaluate(CONTRAST_JS) if c['ratio'] < 3 and not c['image']]
                entry['errors'] = list(errors)
                if not dark:
                    before = len(errors)

                    def click():
                        with page.expect_navigation(timeout=10000):
                            page.locator('nav + div a', has_text=SIGN_IN[loc]).first.click(timeout=5000)

                    attempt(click, entry, 'sign in from the menu')
                    page.wait_for_timeout(2500)
                    entry['url_after'] = page.url.replace(base, '')
                    entry['after'] = errors[before:]
                    entry['accounts_netsnek'] = any('accounts.netsnek.com' in u for u in outside)
                out['drawer'][f'{loc} {"dark" if dark else "light"}'] = entry
                ctx.close()

        # The map notice in each language, and what the contact button opens.
        for loc, pre in LOCALES.items():
            ctx, outside = context()
            page, status, errors, _ = opened(ctx, f'/{pre}')
            notice = page.evaluate("""() => [...document.querySelectorAll('.chakra-alert__root')]
                .map(e => e.innerText.replace(/\\s+/g, ' ').trim())""")
            entry = {'notice': notice}
            attempt(lambda: page.get_by_role('button', name=CONTACT[loc]).first.click(timeout=5000), entry,
                    'contact button')
            page.wait_for_timeout(900)
            entry.update({'dialog': page.get_by_role('dialog').count(),
                          'google': [u for u in outside if 'google' in u], 'errors': errors})
            out['maps'][loc] = entry
            ctx.close()

        # The partner cards share the row from the md breakpoint up.
        for width in (1440, 1024, 768):
            ctx, outside = context(width=width)
            page, *_ = opened(ctx, '/')
            out['cards'][width] = page.evaluate("""() => [...document.querySelectorAll('h3')]
                .filter(h => h.closest('.chakra-stack'))
                .map(h => [h.textContent.trim(), Math.round(h.closest('.chakra-stack').getBoundingClientRect().width)])""")
            ctx.close()

        # Send, in every language. Every POST to emailwerk is written down and
        # then answered here: aborted as if the network failed, refused the way
        # emailwerk refuses, failed with an HTTP error, or accepted the way it
        # queues a mail. None of them leaves the browser, so no mail is sent.
        def send_form(loc, answer, mobile=False, dark=False, consent=True, double=False, delay=0.0,
                      close=False):
            posts = []
            cors = {'Access-Control-Allow-Origin': base}

            def emailwerk(r):
                req = r.request
                if req.method == 'OPTIONS':
                    # Playwright answers CORS preflights itself while routing
                    # is on. This only makes sure none could go out.
                    return r.fulfill(status=204, headers={**cors, 'Access-Control-Allow-Headers': 'content-type'})
                posts.append({'at': time.monotonic(), 'method': req.method, 'url': req.url, 'body': req.post_data,
                              'headers': {k: v for k, v in req.headers.items()
                                          if k in ('content-type', 'authorization', 'cookie', 'origin')}})
                if delay:
                    time.sleep(delay)
                if answer == 'abort':
                    return r.abort()
                status, ctype, body = ANSWER[answer]
                return r.fulfill(status=status, headers={**cors, 'Content-Type': ctype}, body=body)

            ctx, outside = context(mobile=mobile, dark=dark, emailwerk=emailwerk)
            page, status, errors, _ = opened(ctx, f'/{LOCALES[loc]}')
            entry = {'locale': loc, 'answer': answer, 'viewport': 'phone' if mobile else 'desktop',
                     'mode': 'dark' if dark else 'light', 'consent': consent, 'double': double, 'page_url': page.url}
            opener = (CONTACT_ME if mobile else CONTACT)[loc]
            attempt(lambda: page.get_by_role('button', name=opener).first.click(timeout=5000), entry,
                    'contact button')
            page.wait_for_timeout(900)
            form = page.locator('form:has(#firstName)')

            def fill():
                for field, value in FORM.items():
                    form.locator('#' + field).fill(value, timeout=5000)
                if consent:
                    form.locator('label:has(input[type=checkbox])').first.click(timeout=5000)

            attempt(fill, entry, 'fill in the form')
            pressed = time.monotonic()

            def press():
                submit = form.locator('button[type=submit]')
                (submit.dblclick if double else submit.click)(timeout=5000)

            attempt(press, entry, 'press Send')
            if consent:
                attempt(lambda: page.wait_for_selector('[role=dialog] [role=alert], [role=dialog] [role=status]',
                                                       timeout=20000), entry, 'wait for the outcome')
            # The form posts once and never repeats a send. The pause gives a
            # late repeat the time to show up in the count all the same: gqty,
            # which the form used to send through, repeated a network failure
            # one second apart.
            page.wait_for_timeout(1500)
            entry['dialog'] = page.evaluate(DIALOG_JS)
            contrast = page.evaluate(CONTRAST_JS)
            shown = ((entry['dialog'] or {}).get('notice') or {}).get('text') or ''
            entry['low_contrast'] = [c for c in contrast if c['ratio'] < 3 and not c['image']]
            entry['notice_contrast'] = [c for c in contrast if shown and c['kind'] == 'text' and c['text']
                                        and c['text'] in shown]
            if close:
                attempt(lambda: page.locator('[role=dialog] button', has_text=CLOSE[loc]).first.click(timeout=5000),
                        entry, 'close')
                page.wait_for_timeout(900)
                entry['after_close'] = page.evaluate(DIALOG_JS)
                attempt(lambda: page.get_by_role('button', name=opener).first.click(timeout=5000), entry, 'reopen')
                page.wait_for_timeout(900)
                entry['reopened'] = page.evaluate(DIALOG_JS)
            entry.update({'posts': [{**p, 'at': round(p['at'] - pressed, 2)} for p in posts],
                          'errors': errors, 'outside': sorted(set(outside))})
            out['contact'].append(entry)
            ctx.close()

        for loc in LOCALES:
            send_form(loc, 'abort')
        # The phone dialog, opened from the hero's button.
        send_form('ja', 'abort', mobile=True)
        for loc in LOCALES:
            send_form(loc, 'accept', close=True)
        send_form('de', 'refuse')
        send_form('de', 'refuse', mobile=True)
        send_form('de', 'refuse', dark=True)
        send_form('de', 'unauthorized')
        send_form('en', 'fail')
        send_form('de', 'accept', dark=True)
        send_form('ja', 'accept', mobile=True, dark=True)
        send_form('de', 'accept', consent=False)
        # A double click while emailwerk takes its time to answer.
        send_form('de', 'accept', double=True, delay=0.8)

        browser.close()
    srv.shutdown()
    json.dump(out, sys.stdout, ensure_ascii=False)


if __name__ == '__main__':
    main()
