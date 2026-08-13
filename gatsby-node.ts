import { PageConfig } from 'jaen';
import { GatsbyNode } from 'gatsby';
import path from 'path';
import fs from 'fs';
import { buildSearchIndex } from './src/utils/search/build-search-index';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions
}) => {
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
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
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
