import { PageConfig } from 'jaen';
import { GatsbyNode } from 'gatsby';
import path from 'path';
import fs from 'fs';
import { buildSearchIndex } from './src/utils/search/build-search-index';

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
        '@/clients': path.resolve(__dirname, 'src/clients'),
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

export const onPostBuild: GatsbyNode['onPostBuild'] = async ({
  graphql,
  reporter
}) => {
  const result = await graphql<{
    allJaenPage: {
      nodes: Array<{
        id: string;
        slug: string;
        parentPage: {
          id: string;
        } | null;
        template: string | null;
        jaenPageMetadata: {
          title: string;
        };
        jaenFields: Record<string, any> | null;
        pageConfig: PageConfig | null;
        buildPath: string;
      }>;
    };
  }>(`
    query {
      allJaenPage {
        nodes {
          id
          slug
          parentPage {
            id
          }
          template
          jaenPageMetadata {
            title
          }
          jaenFields
          pageConfig
          buildPath
        }
      }
    }
  `);

  if (result.errors || !result.data) {
    reporter.panicOnBuild(
      `Error while running GraphQL query. ${result.errors}`
    );

    return;
  }

  const { allJaenPage } = result.data;

  await preparePagesAndBuildSearch(allJaenPage);
};

async function preparePagesAndBuildSearch(allJaenPage: {
  nodes: Array<{
    id: string;
    slug: string;
    parentPage: {
      id: string;
    } | null;
    template: string | null;
    jaenPageMetadata: {
      title: string;
    };
    jaenFields: Record<string, any> | null;
    pageConfig: PageConfig | null;
    buildPath: string;
  }>;
}) {
  const nodesForSearchIndex = allJaenPage.nodes.map(node => {
    const originPath = node.buildPath;

    let type = node.template;

    if (type && path.extname(type)) {
      type = path.basename(type, path.extname(type));
    }

    return {
      id: node.id,
      path: originPath,
      jaenPageMetadata: node.jaenPageMetadata,
      jaenFields: node.jaenFields,
      type
    };
  });

  const searchIndex = await buildSearchIndex(nodesForSearchIndex as any);

  await fs.promises.writeFile(
    path.join('public', 'search-index.json'),
    JSON.stringify(searchIndex)
  );
}
