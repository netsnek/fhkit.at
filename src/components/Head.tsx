import { Head as JaenHead } from 'jaen';
import * as React from 'react';

import {
  defaultLocale,
  getMessages,
  locales,
  type MessageKey
} from '../locales/messages';
import { localeOfPath } from '../contexts/locale';

type JaenHeadProps = React.ComponentProps<typeof JaenHead>;

/**
 * Props gatsby hands the Head export, widened by the `locale` that
 * gatsby-source-jaen's localized page generation writes into the context.
 */
type SiteHeadProps = Omit<JaenHeadProps, 'children'> & {
  pageContext: JaenHeadProps['pageContext'] & {
    locale?: string;
    /** Set on the 404 pages by gatsby-node.ts. */
    notFound?: boolean;
  };
};

/** Catalog keys of the title and description a route defaults to. */
interface RouteMetadata {
  title: MessageKey;
  description: MessageKey;
}

/**
 * Routes with their own metadata, keyed by path without locale prefix. Pages
 * outside this map keep the title jaen resolves for
 * them and only gain the localized site description.
 */
const routeMetadata: Record<string, RouteMetadata> = {
  '/': { title: 'PageTitleHome', description: 'PageDescriptionHome' },
  '/imprint': {
    title: 'PageTitleImprint',
    description: 'PageDescriptionImprint'
  },
  '/404': { title: 'NotFoundTitle', description: 'NotFoundText' }
};

const localePrefixes = new Set<string>(locales);

/**
 * The site name, and the description placeholder jaen's CMS page list shows for
 * a page without one.
 */
const SITE_NAME = 'Florian Herbert Kleber IT';
const DESCRIPTION_PLACEHOLDER = 'No description';

/**
 * The stored title of a page that nobody titled.
 *
 * gatsby-source-jaen seeds every JaenPage node it creates with
 * `jaenPageMetadata.title = pageConfig.label` (or the capitalized slug when the
 * label is no plain string), so `stored.title` is never empty and would always
 * outrank the localized default. That is what shipped `Home Page` as the title
 * of the English home page, `Imprint page` on the legal notice and the bare
 * slug `root` on the German home page. These placeholders carry no page and no
 * locale information; a title actually written in the CMS differs from all of
 * them and still wins.
 */
const isPlaceholderTitle = (
  title: string,
  label: string | undefined,
  pathname: string
): boolean => {
  const slug = (pathname || '/').split('/').filter(Boolean).pop() ?? '';
  const slugTitle = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    title === label ||
    title === slug ||
    title === slugTitle ||
    title === 'root' ||
    title === SITE_NAME
  );
};

/**
 * The route of a page with its locale prefix and trailing slash removed, so
 * `/ja/imprint/` and `/imprint` both resolve to `/imprint`.
 */
const routeOf = (pathname: string): string => {
  const segments = (pathname || '/').split('/').filter(Boolean);

  if (segments.length > 0 && localePrefixes.has(segments[0]!.toLowerCase())) {
    segments.shift();
  }

  const route = `/${segments.join('/')}`;

  return route === '/404.html' ? '/404' : route;
};

/**
 * The site's Head: jaen's Head with localized metadata defaults.
 *
 * jaen resolves the title as `jaenPageMetadata.title || pageConfig.label ||
 * siteMetadata.title` and the description as `jaenPageMetadata.description ||
 * siteMetadata.description`. Both fallbacks are locale-blind, so every locale of
 * an unedited page ended up with the same English page label.
 *
 * Feeding the localized defaults in as `jaenPageMetadata` puts them one rung
 * above those fallbacks and one rung below the CMS: a title or description
 * edited for this locale still wins, both at build time and live.
 *
 * The catalog is read directly rather than through `useIntl`, because gatsby's
 * Head API renders outside the site's IntlProvider.
 *
 * Built by a factory so the exported component keeps an empty `name`, the way
 * jaen's own `withRedux(...)` Head does. gatsby-plugin-jaen recognizes the head
 * element by a component name of `Head` or `''` and only then mounts the site
 * metadata provider jaen's Head requires, and a literal `const Head = props =>`
 * would lose that name to bundle minification.
 */
const withLocalizedMetadata =
  (Component: React.FC<JaenHeadProps>): React.FC<SiteHeadProps> =>
  props => {
    const pathname = props.location?.pathname ?? '/';
    // The 404 page is rendered for every unknown address, so its language and
    // its route come from the address and the flag, not from the context of
    // whichever 404 page the browser loaded. See wrap-page-element.tsx.
    const notFound = Boolean(props.pageContext?.notFound);
    const locale = notFound
      ? localeOfPath(pathname)
      : props.pageContext?.locale ?? defaultLocale;
    const messages = getMessages(locale);
    const route = routeMetadata[notFound ? '/404' : routeOf(pathname)];

    const stored = props.data?.jaenPage?.jaenPageMetadata;

    const label =
      typeof props.pageContext?.pageConfig?.label === 'string'
        ? props.pageContext.pageConfig.label
        : undefined;

    // Only a title and a description someone actually wrote outrank the
    // locale's default; jaen's own placeholders do not.
    const storedTitle =
      typeof stored?.title === 'string' ? stored.title : undefined;
    const editedTitle =
      storedTitle && !isPlaceholderTitle(storedTitle, label, pathname)
        ? storedTitle
        : undefined;

    const storedDescription =
      typeof stored?.description === 'string'
        ? stored.description.trim()
        : undefined;
    const editedDescription =
      storedDescription && storedDescription !== DESCRIPTION_PLACEHOLDER
        ? storedDescription
        : undefined;

    const jaenPage = {
      ...props.data?.jaenPage,
      jaenPageMetadata: {
        ...stored,
        // A route without its own metadata keeps whatever jaen resolved,
        // placeholder included, rather than losing its title altogether.
        title:
          editedTitle ??
          (route ? messages[route.title] : undefined) ??
          storedTitle,
        description:
          editedDescription ??
          (route ? messages[route.description] : messages.SiteDescription)
      }
    } as JaenHeadProps['data']['jaenPage'];

    return (
      <Component {...props} data={{ ...props.data, jaenPage }}>
        {/* A 404 answer is not a page to index, whatever address it is at. */}
        {notFound ? <meta name="robots" content="noindex" /> : null}
      </Component>
    );
  };

export const Head = withLocalizedMetadata(JaenHead);
