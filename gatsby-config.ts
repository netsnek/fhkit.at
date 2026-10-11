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
         * In production fhkit.at signs in the way adlerhorst does: through
         * netsnek.com's own organization, CMS client and project on
         * accounts.netsnek.com. Florian Herbert Kleber IT is the former name
         * of Netsnek e.U., the editors are the same people, and a separate
         * organization would only mean a second account each. The ids used to
         * be placeholders, which Zitadel answered with a raw
         * `Errors.App.NotFound` page.
         *
         * Zitadel only redirects to addresses registered on the client.
         * https://fhkit.at is among the redirect URIs and the post logout
         * redirect URIs of the CMS application since 2026-10-10, so the
         * hand-off reaches the NETSNEK login form. Before that it ended in
         * Zitadel's "redirect_uri is missing in the client configuration".
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
              organizationId: '268210807970535009',
              clientId: '268283382465631862@cms',
              authority: 'https://accounts.netsnek.com',
              redirectUri:
                process.env.NODE_ENV === 'production'
                  ? 'https://fhkit.at'
                  : 'http://localhost:8000',
              projectIds: ['268283277977065078']
            }
        // No googleAnalytics here on purpose. The id this config carried,
        // G-M58K75M9PG, is PhotonQ's property and came along with the
        // template fork, so every consenting visitor of fhkit.at was counted
        // in PhotonQ's analytics. fhkit.at has no property of its own.
      }
    },
    {
      resolve: `gatsby-jaen-emailwerk`,
      options: {
        // For the CMS's emailwerk pages. The contact form posts to the same
        // address itself, EMAILWERK_URL in src/services/contact.tsx, so the
        // two change together.
        url: 'https://emailwerk.com/graphql'
      }
    }
  ]
};

export default config;
