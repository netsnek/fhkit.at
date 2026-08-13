import React from 'react';
import { IntlProvider } from 'react-intl';

import { PageLocaleContext, PageTranslation } from './contexts/locale';
import { defaultLocale, getMessages } from './locales/messages';

interface LocalePageContext {
  locale?: string;
  prefix?: string;
  translations?: PageTranslation[];
}

interface WrapPageElementArgs {
  element: React.ReactNode;
  props: {
    pageContext?: LocalePageContext;
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
  const locale = pageContext.locale ?? defaultLocale;
  const prefix =
    pageContext.prefix ?? (locale === defaultLocale ? '' : locale);
  const translations = pageContext.translations ?? [];

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
