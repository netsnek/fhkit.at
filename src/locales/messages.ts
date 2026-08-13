/**
 * Localizable chrome strings for fhkit.at.
 *
 * Flat PascalCase keys, one catalog per locale. The German catalog is the
 * source of truth and collects the hardcoded strings of the site: navigation,
 * the contact dialog and its toasts, the search overlay, the theme and language
 * choosers, the blog headings, the per-page metadata defaults, and the text of
 * the confirmation mail.
 *
 * Jaen CMS fields keep their field names; the catalog only carries their
 * `defaultValue`, so an unedited locale renders in its own language while every
 * locale stays editable in the CMS. That matters more here than it looks:
 * gatsby-source-jaen gives each localized page its own JaenPage id, so a field
 * edited on the German page does not reach the other four.
 *
 * Components read the catalog through react-intl (see wrap-page-element.tsx);
 * src/components/Head.tsx reads it directly, because gatsby's Head API renders
 * outside the page providers.
 *
 * Keys missing from a locale fall back to the German value.
 */

export const messagesDe = {
  // Page metadata (src/components/Head.tsx)
  SiteDescription:
    'Florian Herbert Kleber IT: IT-Beratung, Cyber-Security, Cloud und Softwareentwicklung aus Österreich.',
  PageTitleHome: 'Florian Herbert Kleber IT',
  PageDescriptionHome:
    'IT-Beratung, Cyber-Security, Cloud-Dienste und Softwareentwicklung. Kostenlose Erstberatung.',
  PageTitleDocs: 'Dokumentation',
  PageDescriptionDocs:
    'Leitfäden und Referenzen zu unseren Diensten und Projekten.',
  PageTitleImprint: 'Impressum',
  PageDescriptionImprint: 'Impressum und Offenlegung nach österreichischem Recht.',
  PageTitleExperiments: 'Blog',
  PageDescriptionExperiments: 'Beiträge und Notizen aus der täglichen Arbeit.',

  // TopNav and AltTopNav (src/components/navigation/*)
  NavServices: 'Unsere Services',
  NavDocs: 'Dokumentation',
  NavPortfolio: 'Unser Portfolio',
  NavBlog: 'Blog',
  NavContact: 'Kontakt',
  NavContactCta: 'Jetzt anfragen',
  NavOpenMenu: 'Menü öffnen',
  NavCloseMenu: 'Menü schließen',

  // Contact dialog (src/components/ContactModal/ContactModal.tsx)
  ContactHeading: 'Kontaktieren Sie uns',
  ContactIntro:
    'Wir freuen uns über Ihre Nachricht und werden uns schnellstmöglich bei Ihnen melden.',
  ContactFirstName: 'Vorname',
  ContactFirstNamePlaceholder: 'Max',
  ContactLastName: 'Nachname',
  ContactLastNamePlaceholder: 'Mustermann',
  ContactEmail: 'E-Mail',
  ContactEmailPlaceholder: 'max.mustermann@example.com',
  ContactPhone: 'Telefonnummer',
  ContactPhonePlaceholder: '+43 123 456 789',
  ContactMessage: 'Wie können wir Ihnen helfen?',
  ContactMessagePlaceholder: 'Nachricht',
  ContactConsent:
    'Ich bin damit einverstanden, dass meine Angaben zur Kontaktaufnahme und für Rückfragen gespeichert werden.',
  ContactConsentRequired:
    'Bitte bestätigen Sie die Bedingungen zur Kontaktaufnahme',
  ContactSubmit: 'Senden',

  // Contact toasts (src/services/contact.tsx)
  ContactToastErrorTitle: 'Fehler',
  ContactToastErrorDescription: 'Es ist ein Fehler aufgetreten.',
  ContactToastSuccessTitle: 'Erfolg',
  ContactToastSuccessDescription: 'Ihre Nachricht wurde erfolgreich versendet.',

  /**
   * The confirmation mail, sent as `values` on the contact mutation.
   *
   * emailwerk renders the confirmation server-side from the same values the
   * inquiry carried and has no notion of locale, so the only way the visitor's
   * language reaches that mail is to send the text with it. Every key here
   * matches a placeholder in the template, and every placeholder keeps the
   * German original as its own default.
   */
  MailConfirmSubject: 'Ihre Anfrage auf fhkit.at',
  MailConfirmTitle: 'Ihre Anfrage',
  MailConfirmHeading: 'Kontaktanfrage',
  MailConfirmThanks:
    'Vielen Dank für Ihre Kontaktanfrage. Ich melde mich so schnell wie möglich bei Ihnen.',
  MailConfirmLabelName: 'Name:',
  MailConfirmLabelEmail: 'E-Mail:',
  MailConfirmLabelPhone: 'Telefonnummer:',
  MailConfirmLabelMessage: 'Nachricht:',
  MailConfirmQuestions:
    'Haben Sie noch Fragen? Dann schreiben Sie mir gerne an {mail} oder rufen Sie mich unter {phone} an.',
  MailConfirmRights:
    'Alle Rechte vorbehalten. © {year} Florian Herbert Kleber IT',
  MailConfirmWebsite: 'Webseite',
  MailConfirmImprint: 'Impressum',

  // Search overlay (src/components/search-menu/*)
  SearchPlaceholder: 'Suchen',
  SearchNoResults: 'Keine Ergebnisse für "{query}"',
  SearchLabel: 'Suche',

  // Theme chooser (src/components/ThemeChooser.tsx)
  ThemeLight: 'Hell',
  ThemeDark: 'Dunkel',
  ThemeSystem: 'System',

  // Language switcher (src/components/LanguageSwitcher.tsx)
  LanguageSwitcherLabel: 'Sprache',

  // Blog (src/pages/experiments/index.tsx)
  BlogFeatured: 'Ausgewählte Beiträge',
  BlogLatest: 'Neueste Beiträge',

  // Docs (src/templates/DocPage.tsx)
  DocsOnThisPage: 'Auf dieser Seite',

  // Cookie-gated map (src/components/GoogleMaps.tsx)
  MapsUnavailable: 'Google Maps ist nicht verfügbar.',
  MapsEnableCookies:
    'Bitte aktivieren Sie Cookies, um Google Maps anzuzeigen.',
  MapsEnableAnalytics: 'Analyse-Cookies aktivieren'
} as const;

export type MessageKey = keyof typeof messagesDe;
export type MessageCatalog = Record<MessageKey, string>;
export type PartialMessageCatalog = Partial<MessageCatalog>;

export const locales = ['de', 'en', 'sl', 'it', 'ja'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

export const messagesEn: MessageCatalog = {
  SiteDescription:
    'Florian Herbert Kleber IT: IT consulting, cyber security, cloud and software development from Austria.',
  PageTitleHome: 'Florian Herbert Kleber IT',
  PageDescriptionHome:
    'IT consulting, cyber security, cloud services and software development. Free initial consultation.',
  PageTitleDocs: 'Documentation',
  PageDescriptionDocs: 'Guides and references for our services and projects.',
  PageTitleImprint: 'Legal notice',
  PageDescriptionImprint: 'Legal notice and disclosure under Austrian law.',
  PageTitleExperiments: 'Blog',
  PageDescriptionExperiments: 'Posts and notes from the day-to-day work.',

  NavServices: 'Our services',
  NavDocs: 'Documentation',
  NavPortfolio: 'Our portfolio',
  NavBlog: 'Blog',
  NavContact: 'Contact',
  NavContactCta: 'Get in touch',
  NavOpenMenu: 'Open menu',
  NavCloseMenu: 'Close menu',

  ContactHeading: 'Get in touch',
  ContactIntro:
    'We are glad to hear from you and will get back to you as soon as we can.',
  ContactFirstName: 'First name',
  ContactFirstNamePlaceholder: 'Max',
  ContactLastName: 'Last name',
  ContactLastNamePlaceholder: 'Mustermann',
  ContactEmail: 'Email',
  ContactEmailPlaceholder: 'max.mustermann@example.com',
  ContactPhone: 'Phone number',
  ContactPhonePlaceholder: '+43 123 456 789',
  ContactMessage: 'How can we help?',
  ContactMessagePlaceholder: 'Message',
  ContactConsent:
    'I agree that my details may be stored so that my enquiry can be answered and followed up.',
  ContactConsentRequired: 'Please accept the terms for getting in touch',
  ContactSubmit: 'Send',

  ContactToastErrorTitle: 'Error',
  ContactToastErrorDescription: 'Something went wrong.',
  ContactToastSuccessTitle: 'Sent',
  ContactToastSuccessDescription: 'Your message has been sent.',

  MailConfirmSubject: 'Your enquiry on fhkit.at',
  MailConfirmTitle: 'Your enquiry',
  MailConfirmHeading: 'Contact enquiry',
  MailConfirmThanks:
    'Thank you for your enquiry. I will get back to you as soon as I can.',
  MailConfirmLabelName: 'Name:',
  MailConfirmLabelEmail: 'Email:',
  MailConfirmLabelPhone: 'Phone number:',
  MailConfirmLabelMessage: 'Message:',
  MailConfirmQuestions:
    'Any questions left? Write to me at {mail} or call me on {phone}.',
  MailConfirmRights: 'All rights reserved. © {year} Florian Herbert Kleber IT',
  MailConfirmWebsite: 'Website',
  MailConfirmImprint: 'Legal notice',

  SearchPlaceholder: 'Search',
  SearchNoResults: 'No results for "{query}"',
  SearchLabel: 'Search',

  ThemeLight: 'Light',
  ThemeDark: 'Dark',
  ThemeSystem: 'System',

  LanguageSwitcherLabel: 'Language',

  BlogFeatured: 'Featured posts',
  BlogLatest: 'Latest posts',

  DocsOnThisPage: 'On this page',

  MapsUnavailable: 'Google Maps is unavailable.',
  MapsEnableCookies: 'Please enable cookies to display Google Maps.',
  MapsEnableAnalytics: 'Enable analytics cookies'
};

export const messagesSl: MessageCatalog = {
  SiteDescription:
    'Florian Herbert Kleber IT: svetovanje na področju IT, kibernetska varnost, oblak in razvoj programske opreme iz Avstrije.',
  PageTitleHome: 'Florian Herbert Kleber IT',
  PageDescriptionHome:
    'Svetovanje na področju IT, kibernetska varnost, storitve v oblaku in razvoj programske opreme. Brezplačen uvodni posvet.',
  PageTitleDocs: 'Dokumentacija',
  PageDescriptionDocs: 'Vodniki in reference za naše storitve in projekte.',
  PageTitleImprint: 'Impresum',
  PageDescriptionImprint: 'Impresum in razkritje po avstrijskem pravu.',
  PageTitleExperiments: 'Blog',
  PageDescriptionExperiments: 'Prispevki in zapiski iz vsakdanjega dela.',

  NavServices: 'Naše storitve',
  NavDocs: 'Dokumentacija',
  NavPortfolio: 'Naš portfelj',
  NavBlog: 'Blog',
  NavContact: 'Kontakt',
  NavContactCta: 'Pišite nam',
  NavOpenMenu: 'Odpri meni',
  NavCloseMenu: 'Zapri meni',

  ContactHeading: 'Stopite v stik z nami',
  ContactIntro:
    'Veseli bomo vašega sporočila in se bomo javili v najkrajšem možnem času.',
  ContactFirstName: 'Ime',
  ContactFirstNamePlaceholder: 'Max',
  ContactLastName: 'Priimek',
  ContactLastNamePlaceholder: 'Mustermann',
  ContactEmail: 'E-pošta',
  ContactEmailPlaceholder: 'max.mustermann@example.com',
  ContactPhone: 'Telefonska številka',
  ContactPhonePlaceholder: '+43 123 456 789',
  ContactMessage: 'Kako vam lahko pomagamo?',
  ContactMessagePlaceholder: 'Sporočilo',
  ContactConsent:
    'Strinjam se, da se moji podatki shranijo za namen stika in morebitnih dodatnih vprašanj.',
  ContactConsentRequired: 'Prosimo, potrdite pogoje za vzpostavitev stika',
  ContactSubmit: 'Pošlji',

  ContactToastErrorTitle: 'Napaka',
  ContactToastErrorDescription: 'Prišlo je do napake.',
  ContactToastSuccessTitle: 'Poslano',
  ContactToastSuccessDescription: 'Vaše sporočilo je bilo uspešno poslano.',

  MailConfirmSubject: 'Vaše povpraševanje na fhkit.at',
  MailConfirmTitle: 'Vaše povpraševanje',
  MailConfirmHeading: 'Povpraševanje',
  MailConfirmThanks:
    'Hvala za vaše povpraševanje. Javim se vam v najkrajšem možnem času.',
  MailConfirmLabelName: 'Ime:',
  MailConfirmLabelEmail: 'E-pošta:',
  MailConfirmLabelPhone: 'Telefonska številka:',
  MailConfirmLabelMessage: 'Sporočilo:',
  MailConfirmQuestions:
    'Imate še vprašanja? Pišite mi na {mail} ali me pokličite na {phone}.',
  MailConfirmRights:
    'Vse pravice pridržane. © {year} Florian Herbert Kleber IT',
  MailConfirmWebsite: 'Spletna stran',
  MailConfirmImprint: 'Impresum',

  SearchPlaceholder: 'Iskanje',
  SearchNoResults: 'Ni zadetkov za "{query}"',
  SearchLabel: 'Iskanje',

  ThemeLight: 'Svetla',
  ThemeDark: 'Temna',
  ThemeSystem: 'Sistemska',

  LanguageSwitcherLabel: 'Jezik',

  BlogFeatured: 'Izbrani prispevki',
  BlogLatest: 'Najnovejši prispevki',

  DocsOnThisPage: 'Na tej strani',

  MapsUnavailable: 'Google Zemljevidi niso na voljo.',
  MapsEnableCookies:
    'Za prikaz Google Zemljevidov omogočite piškotke.',
  MapsEnableAnalytics: 'Omogoči analitične piškotke'
};

export const messagesIt: MessageCatalog = {
  SiteDescription:
    'Florian Herbert Kleber IT: consulenza IT, cyber security, cloud e sviluppo software dall’Austria.',
  PageTitleHome: 'Florian Herbert Kleber IT',
  PageDescriptionHome:
    'Consulenza IT, cyber security, servizi cloud e sviluppo software. Primo colloquio gratuito.',
  PageTitleDocs: 'Documentazione',
  PageDescriptionDocs: 'Guide e riferimenti per i nostri servizi e progetti.',
  PageTitleImprint: 'Note legali',
  PageDescriptionImprint:
    'Note legali e informazioni obbligatorie secondo il diritto austriaco.',
  PageTitleExperiments: 'Blog',
  PageDescriptionExperiments: 'Articoli e appunti dal lavoro quotidiano.',

  NavServices: 'I nostri servizi',
  NavDocs: 'Documentazione',
  NavPortfolio: 'Il nostro portfolio',
  NavBlog: 'Blog',
  NavContact: 'Contatti',
  NavContactCta: 'Richiedi ora',
  NavOpenMenu: 'Apri il menu',
  NavCloseMenu: 'Chiudi il menu',

  ContactHeading: 'Contattaci',
  ContactIntro:
    'Saremo lieti di ricevere il tuo messaggio e ti risponderemo al più presto.',
  ContactFirstName: 'Nome',
  ContactFirstNamePlaceholder: 'Max',
  ContactLastName: 'Cognome',
  ContactLastNamePlaceholder: 'Mustermann',
  ContactEmail: 'E-mail',
  ContactEmailPlaceholder: 'max.mustermann@example.com',
  ContactPhone: 'Numero di telefono',
  ContactPhonePlaceholder: '+43 123 456 789',
  ContactMessage: 'Come possiamo aiutarti?',
  ContactMessagePlaceholder: 'Messaggio',
  ContactConsent:
    'Acconsento alla conservazione dei miei dati per essere ricontattato e per eventuali domande.',
  ContactConsentRequired: 'Conferma le condizioni per essere ricontattato',
  ContactSubmit: 'Invia',

  ContactToastErrorTitle: 'Errore',
  ContactToastErrorDescription: 'Si è verificato un errore.',
  ContactToastSuccessTitle: 'Inviato',
  ContactToastSuccessDescription: 'Il tuo messaggio è stato inviato.',

  MailConfirmSubject: 'La tua richiesta su fhkit.at',
  MailConfirmTitle: 'La tua richiesta',
  MailConfirmHeading: 'Richiesta di contatto',
  MailConfirmThanks:
    'Grazie per la tua richiesta. Ti risponderò al più presto.',
  MailConfirmLabelName: 'Nome:',
  MailConfirmLabelEmail: 'E-mail:',
  MailConfirmLabelPhone: 'Numero di telefono:',
  MailConfirmLabelMessage: 'Messaggio:',
  MailConfirmQuestions:
    'Hai altre domande? Scrivimi a {mail} oppure chiamami al {phone}.',
  MailConfirmRights:
    'Tutti i diritti riservati. © {year} Florian Herbert Kleber IT',
  MailConfirmWebsite: 'Sito web',
  MailConfirmImprint: 'Note legali',

  SearchPlaceholder: 'Cerca',
  SearchNoResults: 'Nessun risultato per "{query}"',
  SearchLabel: 'Ricerca',

  ThemeLight: 'Chiaro',
  ThemeDark: 'Scuro',
  ThemeSystem: 'Sistema',

  LanguageSwitcherLabel: 'Lingua',

  BlogFeatured: 'Articoli in evidenza',
  BlogLatest: 'Ultimi articoli',

  DocsOnThisPage: 'In questa pagina',

  MapsUnavailable: 'Google Maps non è disponibile.',
  MapsEnableCookies: 'Abilita i cookie per visualizzare Google Maps.',
  MapsEnableAnalytics: 'Abilita i cookie analitici'
};

export const messagesJa: MessageCatalog = {
  SiteDescription:
    'Florian Herbert Kleber IT：オーストリアのITコンサルティング、サイバーセキュリティ、クラウド、ソフトウェア開発。',
  PageTitleHome: 'Florian Herbert Kleber IT',
  PageDescriptionHome:
    'ITコンサルティング、サイバーセキュリティ、クラウドサービス、ソフトウェア開発。初回相談は無料です。',
  PageTitleDocs: 'ドキュメント',
  PageDescriptionDocs: 'サービスとプロジェクトのガイドおよびリファレンス。',
  PageTitleImprint: '法的表示',
  PageDescriptionImprint: 'オーストリア法に基づく法的表示および開示。',
  PageTitleExperiments: 'ブログ',
  PageDescriptionExperiments: '日々の業務からの記事とメモ。',

  NavServices: 'サービス',
  NavDocs: 'ドキュメント',
  NavPortfolio: 'ポートフォリオ',
  NavBlog: 'ブログ',
  NavContact: 'お問い合わせ',
  NavContactCta: 'お問い合わせはこちら',
  NavOpenMenu: 'メニューを開く',
  NavCloseMenu: 'メニューを閉じる',

  ContactHeading: 'お問い合わせ',
  ContactIntro:
    'ご連絡をお待ちしております。できるかぎり早くご返信いたします。',
  ContactFirstName: '名',
  ContactFirstNamePlaceholder: 'Max',
  ContactLastName: '姓',
  ContactLastNamePlaceholder: 'Mustermann',
  ContactEmail: 'メールアドレス',
  ContactEmailPlaceholder: 'max.mustermann@example.com',
  ContactPhone: '電話番号',
  ContactPhonePlaceholder: '+43 123 456 789',
  ContactMessage: 'ご用件をお聞かせください',
  ContactMessagePlaceholder: 'メッセージ',
  ContactConsent:
    'お問い合わせおよびご返信のために、入力した情報が保存されることに同意します。',
  ContactConsentRequired: 'お問い合わせの条件に同意してください',
  ContactSubmit: '送信',

  ContactToastErrorTitle: 'エラー',
  ContactToastErrorDescription: 'エラーが発生しました。',
  ContactToastSuccessTitle: '送信しました',
  ContactToastSuccessDescription: 'メッセージを送信しました。',

  MailConfirmSubject: 'fhkit.at へのお問い合わせ',
  MailConfirmTitle: 'お問い合わせ内容',
  MailConfirmHeading: 'お問い合わせ',
  MailConfirmThanks:
    'お問い合わせいただきありがとうございます。できるかぎり早くご連絡いたします。',
  MailConfirmLabelName: 'お名前:',
  MailConfirmLabelEmail: 'メールアドレス:',
  MailConfirmLabelPhone: '電話番号:',
  MailConfirmLabelMessage: 'メッセージ:',
  MailConfirmQuestions:
    'ご不明な点がございましたら、{mail} までメールでご連絡いただくか、{phone} までお電話ください。',
  MailConfirmRights: '無断転載を禁じます。© {year} Florian Herbert Kleber IT',
  MailConfirmWebsite: 'ウェブサイト',
  MailConfirmImprint: '法的表示',

  SearchPlaceholder: '検索',
  SearchNoResults: '「{query}」の検索結果はありません',
  SearchLabel: '検索',

  ThemeLight: 'ライト',
  ThemeDark: 'ダーク',
  ThemeSystem: 'システム',

  LanguageSwitcherLabel: '言語',

  BlogFeatured: '注目の記事',
  BlogLatest: '最新の記事',

  DocsOnThisPage: 'このページの内容',

  MapsUnavailable: 'Google マップを利用できません。',
  MapsEnableCookies: 'Google マップを表示するには Cookie を有効にしてください。',
  MapsEnableAnalytics: '分析 Cookie を有効にする'
};

const catalogs: Record<Locale, MessageCatalog> = {
  de: messagesDe,
  en: messagesEn,
  sl: messagesSl,
  it: messagesIt,
  ja: messagesJa
};

/**
 * Resolves the message catalog for a locale. Region subtags are ignored
 * ("de-AT" resolves to "de"). Unknown locales and missing keys fall back to the
 * German default catalog.
 */
export const getMessages = (locale: string): MessageCatalog => {
  const base = (locale || defaultLocale)
    .toLowerCase()
    .split(/[-_]/)[0] as Locale;

  if (base === defaultLocale || !locales.includes(base)) {
    return catalogs.de;
  }

  return { ...catalogs.de, ...catalogs[base] };
};

export default catalogs;
