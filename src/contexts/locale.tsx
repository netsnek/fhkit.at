import React, { createContext, useContext } from 'react';

import { defaultLocale } from '../locales/messages';

/**
 * A sibling translation of the current page, as emitted by
 * gatsby-source-jaen's localized page generation into the page context.
 */
export interface PageTranslation {
  locale: string;
  prefix: string;
  path: string;
}

export interface PageLocaleContextValue {
  /** Locale of the current page (`de` when the page carries none). */
  locale: string;
  /** Path prefix of the current locale (empty for the default locale). */
  prefix: string;
  /** Sibling translations of the current page. */
  translations: PageTranslation[];
}

export const PageLocaleContext = createContext<PageLocaleContextValue>({
  locale: 'de',
  prefix: '',
  translations: []
});

/**
 * Locale info of the current page, provided by the site's wrapPageElement
 * from the Gatsby page context.
 */
export const usePageLocale = (): PageLocaleContextValue =>
  useContext(PageLocaleContext);

/**
 * Turn an unprefixed site path into the path for the CURRENT locale.
 *
 * The default locale is served unprefixed — `/docs`, never `/de/docs`, which
 * does not exist — while every other locale lives under its prefix. Note that
 * `prefix` is set for every locale including the default (it is the locale's
 * prefix, not "the prefix this page happens to have"), so the default has to
 * be excluded explicitly. Getting that wrong is a 404 on every nav link.
 */
export const useLocalizeHref = (): ((href: string) => string) => {
  const { locale, prefix } = usePageLocale();

  return (href: string): string => {
    if (!prefix || locale === defaultLocale) return href;

    return `/${prefix}${href.startsWith('/') ? href : `/${href}`}`;
  };
};