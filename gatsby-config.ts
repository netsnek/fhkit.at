import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: `https://fhkit.at`
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  flags: {
    DEV_SSR: false
  },
  plugins: [
    `gatsby-plugin-cloudflare-pages`,
    {
      resolve: `gatsby-plugin-jaen`,
      options: {
        remote: {
          repository: 'netsnek/fhkit.at'
        },
        // Feeds the canonical links, the hreflang alternates and the sitemap.
        // gatsby-source-jaen skips all three with a warning when it is absent,
        // and it was the template's `https://www.yourdomain.tld` until now.
        siteUrl: 'https://fhkit.at',
        /**
         * Forwarded verbatim to gatsby-source-jaen, which owns the localized
         * page generation: every page under src/pages fans out into one page
         * per locale, German keeps the bare path and the rest take their
         * prefix, and each locale gets its own JaenPage id so an editor can
         * write each language separately.
         *
         * The set matches netsnek.com so the two sites stay comparable.
         */
        i18n: {
          defaultLocale: 'de',
          locales: [
            { locale: 'de' },
            { locale: 'en' },
            { locale: 'sl' },
            { locale: 'it' },
            { locale: 'ja' }
          ]
        },
        /**
         * Set JAEN_MOCK_OIDC to sign in against jaen's local mock provider
         * instead of Zitadel:
         *
         *   node ../jaen/tests/support/mock-oidc.mjs        # in one terminal
         *   JAEN_MOCK_OIDC=1 yarn develop                   # in another
         *
         * and log in with admin / jaen.
         *
         * TODO: organizationId, clientId and projectIds below are placeholders.
         * fhkit.at is moving off accounts.cronit.io onto the Zitadel that
         * netsnek.com uses, and the three ids only exist once the fhkit
         * organisation and its CMS application have been created there. The
         * authority and redirectUri are already correct.
         */
        zitadelGql: process.env.JAEN_MOCK_OIDC
          ? {
              clientId: 'jaen-dev',
              authority:
                process.env.JAEN_MOCK_OIDC_URL || 'http://127.0.0.1:9099',
              redirectUri: 'http://localhost:8000',
              rolesClaim: 'roles'
            }
          : {
              organizationId: 'TODO_FHKIT_ORGANIZATION_ID',
              clientId: 'TODO_FHKIT_CLIENT_ID@cms',
              authority: 'https://accounts.netsnek.com',
              redirectUri:
                process.env.NODE_ENV === 'production'
                  ? 'https://fhkit.at'
                  : 'http://localhost:8000',
              projectIds: ['TODO_FHKIT_PROJECT_ID']
            },
        googleAnalytics: {
          trackingIds: ['G-M58K75M9PG']
        }
      }
    },
    {
      resolve: `gatsby-jaen-emailwerk`,
      options: {
        url: 'https://emailwerk.com/graphql'
      }
    }
  ]
};

export default config;
