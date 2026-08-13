import { PageConfig } from 'jaen';
import { PageProps, graphql } from 'gatsby';
import * as React from 'react';
import MdxEditor from '../components/mdx-editor/MdxEditor';

/**
 * The page renders the MDX editor alone.
 *
 * Everything else this file used to hold — the table of contents, the right
 * nav and the feedback links — sat below an unconditional `return <MdxEditor/>`
 * and had been unreachable since the file was written. It is removed rather
 * than left in place, because unreachable JSX still has to be migrated to
 * Chakra v3 and translated into five languages, and none of that work would
 * ever show up on a page.
 */
const DocsPage: React.FC<PageProps> = () => {
  return <MdxEditor />;
};

export default DocsPage;

export const pageConfig: PageConfig = {
  label: 'Documentation',
  icon: 'FaBook',
  childTemplates: ['DocPage'],
  withoutJaenFrameStickyHeader: true,
  menu: {
    type: 'app',
    order: 100,
    group: 'fhkit'
  }
};

export const query = graphql`
  query ($jaenPageId: String!) {
    jaenPage(id: { eq: $jaenPageId }) {
      ...JaenPageData
    }
    allJaenPage(filter: { id: { eq: "JaenPage /docs/" } }) {
      nodes {
        id
        childPages {
          ...JaenPageChildrenData
        }
      }
    }
  }
`;

export { Head } from 'jaen';
