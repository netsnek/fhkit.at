import React from 'react';
import { IntlProvider } from 'react-intl';

import {
  PageLocaleContext,
  PageTranslation,
  localeOfPath
} from './contexts/locale';
import { defaultLocale, getMessages } from './locales/messages';

interface LocalePageContext {
  locale?: string;
  prefix?: string;
  translations?: PageTranslation[];
  /** Set on the 404 pages by gatsby-node.ts. */
  notFound?: boolean;
}

interface WrapPageElementArgs {
  element: React.ReactNode;
  props: {
    pageContext?: LocalePageContext;
    location?: { pathname: string };
  };
}

/**
 * Wraps every page in react-intl's IntlProvider plus the site's locale
 * context. The locale comes from the page context set by
 * gatsby-source-jaen's localized page generation; pages without one
 * (system routes) render in the default locale.
 *
 * Shared by gatsby-browser.tsx and gatsby-ssr.tsx.
 */
export const wrapPageElement = ({ element, props }: WrapPageElementArgs) => {
  const pageContext = props.pageContext ?? {};

  /**
   * The 404 page takes its locale from the address, not from its context.
   *
   * The browser shows the page data of /404.html for every unknown address,
   * in every language, while Cloudflare Pages serves the nearest 404.html,
   * so /en/whatever arrives with the HTML of /en/404.html. Reading the locale
   * off the address gives the server render (path /en/404.html) and the
   * browser's render (path /en/whatever) the same language, so the page
   * hydrates without a mismatch and in the visitor's language.
   */
  const addressLocale = pageContext.notFound
    ? localeOfPath(props.location?.pathname)
    : undefined;

  const locale = addressLocale ?? pageContext.locale ?? defaultLocale;
  const prefix = addressLocale
    ? addressLocale === defaultLocale
      ? ''
      : addressLocale
    : pageContext.prefix ?? (locale === defaultLocale ? '' : locale);
  const translations = addressLocale ? [] : pageContext.translations ?? [];

  return (
    <IntlProvider
      locale={locale}
      defaultLocale={defaultLocale}
      messages={getMessages(locale)}
    >
      <PageLocaleContext.Provider value={{ locale, prefix, translations }}>
        {element}
      </PageLocaleContext.Provider>
    </IntlProvider>
  );
};
