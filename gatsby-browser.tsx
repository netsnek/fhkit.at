import type { GatsbyBrowser } from 'gatsby';

import './src/styles/global.css';

export { wrapPageElement } from './src/wrap-page-element';

/**
 * Keep the visitor's address on a localized 404 page.
 *
 * Pages answers /en/whatever with the HTML of /en/404.html, and that HTML
 * announces itself as `window.pagePath = "/en/404.html"`. Before its first
 * render Gatsby compares that path with the address and navigates to it,
 * unless it is one of Gatsby's own 404 paths (/404, /404/, /404.html). So the
 * address bar turned into /en/404.html and the mistyped address was gone.
 *
 * The localized copies render the same component as /404.html, and for an
 * unknown address the browser renders the page data of /404.html anyway, so
 * they are announced as /404.html. The language still comes from the address
 * (wrap-page-element.tsx), which is what the server render used as well.
 */
export const onClientEntry: GatsbyBrowser['onClientEntry'] = () => {
  const page = window as Window & { pagePath?: string };

  if (page.pagePath && /^\/[a-z]{2}\/404\.html$/.test(page.pagePath)) {
    page.pagePath = '/404.html';
  }
};
