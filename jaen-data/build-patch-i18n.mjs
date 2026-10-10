/**
 * Generates patch-i18n.json: the translated texts of the localized pages, as
 * stored CMS content.
 *
 * jaen's i18n fans every page out into one JaenPage per locale (`JaenPage
 * /en/` beside `JaenPage /`), and each clone is edited on its own. The clones
 * had no content, so /en/, /sl/, /it/ and /ja/ fell back to the fields'
 * defaults, which were German. The defaults come from the catalog in
 * src/locales/messages.ts now, and this script writes the same translations
 * INTO the localized pages, which is jaen's model: content in the CMS data,
 * editable per locale. It is the approach of nadine-hauswirth's script of the
 * same name.
 *
 * A text an editor changes in the CMS later still wins: a publish appends a
 * newer patch to patches.txt, and a later patch overrides an earlier one.
 *
 * The field-to-key pairs are read out of the component sources: `name="X"`
 * followed by `fieldText('Y')` in the same element, and the footer's link
 * entries, whose field names are built from their labels. The script fails if
 * a `fieldText` key of those sources is not covered, so a new field cannot be
 * forgotten silently.
 *
 * The 404 pages get no entry on purpose. The browser renders the page data of
 * /404.html at every unknown address, so a 404 page's content has to be the
 * same in every locale; its texts follow the address through the catalog
 * defaults instead.
 *
 * Run: node jaen-data/build-patch-i18n.mjs   (after every catalog change)
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const here = path.dirname(url.fileURLToPath(import.meta.url))
const root = path.join(here, '..')
const STAMP = '2026-10-10T18:00:00.000Z'

// messages.ts is TypeScript; esbuild turns it into something import()able.
const tmp = path.join(here, '.messages.tmp.mjs')
execFileSync(path.join(root, 'node_modules/esbuild/bin/esbuild'), [
  path.join(root, 'src/locales/messages.ts'),
  '--bundle',
  '--format=esm',
  '--log-level=warning',
  `--outfile=${tmp}`
])
const { default: catalogs, defaultLocale, locales } = await import(
  url.pathToFileURL(tmp).href
)
fs.rmSync(tmp)

const read = file => fs.readFileSync(path.join(root, file), 'utf8')

/** `name="X" ... fieldText('Y')` inside one JSX element. */
const jsxPairs = src => {
  const pairs = []
  const re = /name="([^"]+)"(?:(?!\/>)[\s\S])*?fieldText\('([A-Za-z0-9_]+)'\)/g
  let m
  while ((m = re.exec(src))) pairs.push([m[1], m[2]])
  return pairs
}

/**
 * The footer's link entries. A title's field is FooterLinkTitle<label>, a
 * link's FooterLink<label>, so the names are built here the way Footer.tsx
 * builds them.
 */
const footerLinkPairs = src => {
  const pairs = []
  const re =
    /label: '([^']+)',\s*text: fieldText\('([A-Za-z0-9_]+)'\),\s*(isTitle: true|href)/g
  let m
  while ((m = re.exec(src))) {
    const prefix = m[3] === 'isTitle: true' ? 'FooterLinkTitle' : 'FooterLink'
    pairs.push([prefix + m[1], m[2]])
  }
  return pairs
}

const pairsOf = file => {
  const src = read(file)
  const pairs = [...jsxPairs(src), ...footerLinkPairs(src)]

  const used = new Set([...src.matchAll(/fieldText\('([A-Za-z0-9_]+)'\)/g)].map(m => m[1]))
  const covered = new Set(pairs.map(([, key]) => key))
  const missing = [...used].filter(key => !covered.has(key))
  if (missing.length > 0) {
    throw new Error(`${file}: no field name found for ${missing.join(', ')}`)
  }

  return pairs
}

const HOME_FILES = [
  'src/pages/index.tsx',
  'src/components/sections/Hero.tsx',
  'src/components/sections/Footer.tsx'
]
const FOOTER_FILES = ['src/components/sections/Footer.tsx']

/** The site's pages and the files whose fields render on them. */
const PAGES = [
  { path: '/', files: HOME_FILES },
  { path: '/imprint/', files: FOOTER_FILES }
]

const fieldsFor = (files, locale) => {
  const fields = {}
  for (const [name, key] of files.flatMap(pairsOf)) {
    const value = catalogs[locale][key]
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error(`${locale}: no text for ${key}`)
    }
    fields[name] = { value }
  }
  return fields
}

/**
 * Every entry carries the node skeleton: a page sourced from jaen-data IS the
 * node, and JaenPage.sections is non-nullable in the schema, so an entry
 * without it kills the build ("Cannot return null for non-nullable field").
 */
const pages = []
for (const locale of locales.filter(l => l !== defaultLocale)) {
  for (const { path: pagePath, files } of PAGES) {
    pages.push({
      id: `JaenPage /${locale}${pagePath}`,
      sections: [],
      childPages: [],
      childPagesOrder: [],
      jaenFields: { 'IMA:TextField': fieldsFor(files, locale) }
    })
  }
}

const patch = {
  message: 'Englische, slowenische, italienische und japanische Seitentexte',
  createdAt: STAMP,
  data: { pages, widgets: [] }
}

const out = path.join(here, 'patch-i18n.json')
fs.writeFileSync(out, JSON.stringify(patch, null, 1) + '\n')
console.log(
  out,
  '|',
  pages
    .map(p => `${p.id}: ${Object.keys(p.jaenFields['IMA:TextField']).length}`)
    .join(' | ')
)
