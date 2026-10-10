import { GatsbyNode } from 'gatsby';
import fs from 'fs';
import path from 'path';

import { defaultLocale, locales } from './src/locales/messages';

/**
 * Keep src/templates in existence, even empty.
 *
 * jaen's page renderer loads CMS page templates with a dynamic import from
 * that directory, so webpack fails the build when it is missing ("Can't
 * resolve .../src/templates"). fhkit.at has no page template since the docs
 * pages went, and git does not keep an empty directory. A placeholder file
 * would not do: gatsby-source-jaen offers every file in there as a template
 * in the CMS. The path is built the way gatsby-source-jaen builds it.
 */
export const onPreInit: GatsbyNode['onPreInit'] = () => {
  fs.mkdirSync(path.join(process.cwd(), 'src', 'templates'), {
    recursive: true
  });
};

/**
 * A 404 page per language, for Cloudflare Pages.
 *
 * Pages answers an unknown address with the NEAREST 404.html and status 404:
 * /ja/whatever gets /ja/404.html if it exists, /404.html otherwise. Gatsby
 * only writes /404.html (from src/pages/404.tsx, copied from /404/), so this
 * adds /en/404.html, /sl/404.html, /it/404.html and /ja/404.html.
 *
 * gatsby-source-jaen never fans a 404 page out into the locales, and it should
 * not: the browser renders the page data of /404.html for every unknown
 * address anyway. So the copies are plain extra files, and every 404 page
 * carries `notFound`, which makes the site take the language from the address
 * instead (wrap-page-element.tsx, Head.tsx). The server render of
 * /ja/404.html and the browser's render at /ja/whatever then agree, and so
 * does jaen's consent banner, which reads its language from the address too.
 *
 * The default locale is set on /404/ (and so on /404.html, which Gatsby copies
 * from it with its context), which is what gives the German page its
 * `<html lang>`. Pages created here run through gatsby-source-jaen's own
 * onCreatePage, which gives each copy its locale and its own JaenPage.
 */
export const onCreatePage: GatsbyNode['onCreatePage'] = ({ page, actions }) => {
  if (page.path !== '/404/' && page.path !== '/404') return;

  const { createPage, deletePage } = actions;

  if (!page.context?.notFound) {
    deletePage(page);
    createPage({
      ...page,
      context: { locale: defaultLocale, ...page.context, notFound: true }
    });
  }

  for (const locale of locales) {
    if (locale === defaultLocale) continue;

    createPage({
      path: `/${locale}/404.html`,
      component: page.component,
      context: { notFound: true }
    });
  }
};

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  stage,
  actions
}) => {
  /**
   * No source maps in the production bundle.
   *
   * They were 3550 of the build's 8886 files and about 60 of its 104 MB, which
   * is what made `wrangler pages deploy` give up after eighteen upload attempts
   * with an empty error. They also publish the site's own sources, including
   * every comment, to anyone who asks for the .map next to a chunk.
   *
   * Development keeps them: this only touches the two production stages.
   */
  if (stage === 'build-javascript' || stage === 'build-html') {
    actions.setWebpackConfig({ devtool: false });
  }

  actions.setWebpackConfig({
    resolve: {
      alias: {
        /**
         * jaen and its plugins arrive as `link:` dependencies, so each one
         * resolves these from its own node_modules unless they are pinned
         * here. Two copies of any of them is a silent, hard-to-read failure
         * rather than an error:
         *
         *   next-themes       two providers, and the colour mode stops
         *                     switching, because jaen writes the class on
         *                     <html> through a context the site is not in.
         *   @chakra-ui/react  two systems, two token blocks, and `asChild`
         *                     stops recognising components across the seam.
         *   @emotion/react    two caches, so styles insert in an order
         *                     neither half agreed on.
         *   react/react-dom   two renderers, and hooks throw on sight.
         */
        'next-themes': path.resolve(__dirname, 'node_modules/next-themes'),
        '@chakra-ui/react': path.resolve(
          __dirname,
          'node_modules/@chakra-ui/react'
        ),
        '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react'),
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),

        /**
         * The same argument, for the packages the linked plugins reach for
         * rather than the site.
         *
         * gqty is gatsby-jaen-emailwerk's GraphQL client, and a second nested
         * copy pulls gqty's CommonJS files into an ESM context: webpack parses
         * `gqty/Utils/hash.js` as a module and the bundle dies on "exports is
         * not defined" before the app renders.
         *
         * The CodeMirror and lezer family carry jaen-fields-mdx's editor.
         * CodeMirror compares languages and extensions by FACET IDENTITY, so a
         * facet from one copy is not the facet the other copy reads: an
         * extension is handed over and quietly ignored, everything renders in
         * the default grey and nothing is raised anywhere.
         *
         * acorn is not two copies but two FORMATS of one, which is enough to
         * ship it twice: its exports map offers dist/acorn.mjs under `import`
         * and dist/acorn.js under `require`, and the MDX runtime reaches it
         * from both sides. The exact-match alias collapses both onto the ESM
         * build, and that direction only: webpack lets CommonJS require an ES
         * module and hands back the namespace object, while named imports out
         * of the UMD build into strict ESM is the case that does not hold.
         */
        gqty: path.resolve(__dirname, 'node_modules/gqty'),
        '@gqty/react': path.resolve(__dirname, 'node_modules/@gqty/react'),
        'use-sync-external-store': path.resolve(
          __dirname,
          'node_modules/use-sync-external-store'
        ),
        graphql: path.resolve(__dirname, 'node_modules/graphql'),
        acorn$: path.resolve(__dirname, 'node_modules/acorn/dist/acorn.mjs'),
        '@codemirror/state': path.resolve(
          __dirname,
          'node_modules/@codemirror/state'
        ),
        '@codemirror/view': path.resolve(
          __dirname,
          'node_modules/@codemirror/view'
        ),
        '@codemirror/language': path.resolve(
          __dirname,
          'node_modules/@codemirror/language'
        ),
        '@lezer/common': path.resolve(__dirname, 'node_modules/@lezer/common'),
        '@lezer/highlight': path.resolve(
          __dirname,
          'node_modules/@lezer/highlight'
        ),
        '@lezer/lr': path.resolve(__dirname, 'node_modules/@lezer/lr')
      }
    }
  });
};
