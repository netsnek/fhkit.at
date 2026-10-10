/**
 * Localizable chrome strings for fhkit.at.
 *
 * Flat PascalCase keys, one catalog per locale. The German catalog is the
 * source of truth and collects the hardcoded strings of the site: navigation,
 * the contact dialog and its toasts, the theme and language choosers, the
 * per-page metadata defaults, and the text of the confirmation mail.
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
  PageTitleImprint: 'Impressum',
  PageDescriptionImprint: 'Impressum und Offenlegung nach österreichischem Recht.',

  // The home page's top bar (src/components/navigation/AltTopNav.tsx)
  NavContact: 'Kontakt',
  NavContactCta: 'Jetzt anfragen',

  // The top bar of every other page and its phone menu
  // (src/components/navigation/TopNav.tsx, page-directory/PageDirectory.tsx)
  NavHome: 'Startseite',
  NavSignIn: 'Anmelden',
  NavMenu: 'Menü',
  NavSectionNavigation: 'Navigation',
  NavSectionMore: 'Mehr',

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


  // Theme chooser (src/components/ThemeChooser.tsx)
  ThemeLight: 'Hell',
  ThemeDark: 'Dunkel',
  ThemeSystem: 'System',

  // Language switcher (src/components/LanguageSwitcher.tsx)
  LanguageSwitcherLabel: 'Sprache',



  // Cookie-gated map (src/components/GoogleMaps.tsx)
  MapsUnavailable: 'Google Maps ist nicht verfügbar.',
  MapsEnableCookies:
    'Bitte aktivieren Sie Cookies, um Google Maps anzuzeigen.',
  MapsEnableAnalytics: 'Analyse-Cookies aktivieren',

  // The 404 page (src/pages/404.tsx), also its title and description
  NotFoundTitle: 'Seite nicht gefunden',
  NotFoundText: 'Unter dieser Adresse gibt es keine Seite.',
  NotFoundBackHome: 'Zur Startseite'
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
  PageTitleImprint: 'Legal notice',
  PageDescriptionImprint: 'Legal notice and disclosure under Austrian law.',

  NavContact: 'Contact',
  NavContactCta: 'Get in touch',
  NavHome: 'Home',
  NavSignIn: 'Sign in',
  NavMenu: 'Menu',
  NavSectionNavigation: 'Navigation',
  NavSectionMore: 'More',

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


  ThemeLight: 'Light',
  ThemeDark: 'Dark',
  ThemeSystem: 'System',

  LanguageSwitcherLabel: 'Language',



  MapsUnavailable: 'Google Maps is unavailable.',
  MapsEnableCookies: 'Please enable cookies to display Google Maps.',
  MapsEnableAnalytics: 'Enable analytics cookies',

  NotFoundTitle: 'Page not found',
  NotFoundText: 'There is no page at this address.',
  NotFoundBackHome: 'Go to the home page'
};

export const messagesSl: MessageCatalog = {
  SiteDescription:
    'Florian Herbert Kleber IT: svetovanje na področju IT, kibernetska varnost, oblak in razvoj programske opreme iz Avstrije.',
  PageTitleHome: 'Florian Herbert Kleber IT',
  PageDescriptionHome:
    'Svetovanje na področju IT, kibernetska varnost, storitve v oblaku in razvoj programske opreme. Brezplačen uvodni posvet.',
  PageTitleImprint: 'Impresum',
  PageDescriptionImprint: 'Impresum in razkritje po avstrijskem pravu.',

  NavContact: 'Kontakt',
  NavContactCta: 'Pišite nam',
  NavHome: 'Domov',
  NavSignIn: 'Prijava',
  NavMenu: 'Meni',
  NavSectionNavigation: 'Navigacija',
  NavSectionMore: 'Več',

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


  ThemeLight: 'Svetla',
  ThemeDark: 'Temna',
  ThemeSystem: 'Sistemska',

  LanguageSwitcherLabel: 'Jezik',



  MapsUnavailable: 'Google Zemljevidi niso na voljo.',
  MapsEnableCookies:
    'Za prikaz Google Zemljevidov omogočite piškotke.',
  MapsEnableAnalytics: 'Omogoči analitične piškotke',

  NotFoundTitle: 'Strani ni mogoče najti',
  NotFoundText: 'Na tem naslovu ni strani.',
  NotFoundBackHome: 'Na domačo stran'
};

export const messagesIt: MessageCatalog = {
  SiteDescription:
    'Florian Herbert Kleber IT: consulenza IT, cyber security, cloud e sviluppo software dall’Austria.',
  PageTitleHome: 'Florian Herbert Kleber IT',
  PageDescriptionHome:
    'Consulenza IT, cyber security, servizi cloud e sviluppo software. Primo colloquio gratuito.',
  PageTitleImprint: 'Note legali',
  PageDescriptionImprint:
    'Note legali e informazioni obbligatorie secondo il diritto austriaco.',

  NavContact: 'Contatti',
  NavContactCta: 'Richiedi ora',
  NavHome: 'Home',
  NavSignIn: 'Accedi',
  NavMenu: 'Menu',
  NavSectionNavigation: 'Navigazione',
  NavSectionMore: 'Altro',

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


  ThemeLight: 'Chiaro',
  ThemeDark: 'Scuro',
  ThemeSystem: 'Sistema',

  LanguageSwitcherLabel: 'Lingua',



  MapsUnavailable: 'Google Maps non è disponibile.',
  MapsEnableCookies: 'Abilita i cookie per visualizzare Google Maps.',
  MapsEnableAnalytics: 'Abilita i cookie analitici',

  NotFoundTitle: 'Pagina non trovata',
  NotFoundText: 'A questo indirizzo non c’è nessuna pagina.',
  NotFoundBackHome: 'Vai alla home page'
};

export const messagesJa: MessageCatalog = {
  SiteDescription:
    'Florian Herbert Kleber IT：オーストリアのITコンサルティング、サイバーセキュリティ、クラウド、ソフトウェア開発。',
  PageTitleHome: 'Florian Herbert Kleber IT',
  PageDescriptionHome:
    'ITコンサルティング、サイバーセキュリティ、クラウドサービス、ソフトウェア開発。初回相談は無料です。',
  PageTitleImprint: '法的表示',
  PageDescriptionImprint: 'オーストリア法に基づく法的表示および開示。',

  NavContact: 'お問い合わせ',
  NavContactCta: 'お問い合わせはこちら',
  NavHome: 'ホーム',
  NavSignIn: 'ログイン',
  NavMenu: 'メニュー',
  NavSectionNavigation: 'ナビゲーション',
  NavSectionMore: 'その他',

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


  ThemeLight: 'ライト',
  ThemeDark: 'ダーク',
  ThemeSystem: 'システム',

  LanguageSwitcherLabel: '言語',



  MapsUnavailable: 'Google マップを利用できません。',
  MapsEnableCookies: 'Google マップを表示するには Cookie を有効にしてください。',
  MapsEnableAnalytics: '分析 Cookie を有効にする',

  NotFoundTitle: 'ページが見つかりません',
  NotFoundText: 'このアドレスにはページがありません。',
  NotFoundBackHome: 'ホームページへ'
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
