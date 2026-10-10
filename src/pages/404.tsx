import { PageConfig, PageProps } from 'jaen';

import { Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { Link as GatsbyLink, graphql } from 'gatsby';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { useLocalizeHref } from '../contexts/locale';
import useNavOffset from '../hooks/use-nav-offset';

/**
 * The page for addresses that do not exist.
 *
 * Without it Cloudflare Pages took the site for a single-page app and answered
 * every unknown address with the home page and status 200, so a mistyped or
 * outdated link looked like a working page and search engines indexed copies
 * of the home page under any address they were given.
 *
 * Gatsby writes it to /404.html, and gatsby-node.ts adds /en/404.html,
 * /sl/404.html, /it/404.html and /ja/404.html. Pages serves the nearest one
 * with status 404, so /ja/whatever gets the Japanese page. The language is
 * read from the address (see wrap-page-element.tsx), because the browser
 * always renders the data of /404.html, whichever file Pages sent.
 */
const NotFoundPage: React.FC<PageProps> = () => {
  const intl = useIntl();
  const localizeHref = useLocalizeHref();
  // The top navigation is fixed, so the content starts below it, as on the
  // legal notice.
  const offset = useNavOffset();

  return (
    <Container maxW="4xl" mt={offset} py={{ base: 16, md: 24 }}>
      <Stack gap={6} alignItems="center" textAlign="center">
        <Text
          aria-hidden="true"
          fontSize={{ base: '6xl', md: '8xl' }}
          fontWeight="bold"
          lineHeight={1}
        >
          404
        </Text>
        <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }}>
          {intl.formatMessage({
            id: 'NotFoundTitle',
            defaultMessage: 'Seite nicht gefunden'
          })}
        </Heading>
        <Text fontSize="lg" color={{ base: 'gray.600', _dark: 'gray.400' }}>
          {intl.formatMessage({
            id: 'NotFoundText',
            defaultMessage: 'Unter dieser Adresse gibt es keine Seite.'
          })}
        </Text>
        <Button size="lg" mt={2} asChild>
          <GatsbyLink to={localizeHref('/')}>
            {intl.formatMessage({
              id: 'NotFoundBackHome',
              defaultMessage: 'Zur Startseite'
            })}
          </GatsbyLink>
        </Button>
      </Stack>
    </Container>
  );
};

export default NotFoundPage;

export const pageConfig: PageConfig = {
  label: 'Not found',
  childTemplates: []
};

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
  }
`;

export { Head } from '../components/Head';
