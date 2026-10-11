/**
 * Localizable chrome strings for fhkit.at.
 *
 * Flat PascalCase keys, one catalog per locale. The German catalog is the
 * source of truth and collects the hardcoded strings of the site: navigation,
 * the contact dialog and what it shows after a send, the theme and language
 * choosers, the per-page metadata defaults, and the text of the confirmation
 * mail.
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

  // What the contact dialog shows after Send, in place of the toasts it had
  // (src/components/ContactModal/ContactModal.tsx). {email} is the office
  // mailbox, linked with the enquiry already written out.
  ContactSuccessTitle: 'Ihre Nachricht wurde gesendet',
  ContactSuccessText: 'Vielen Dank! Wir melden uns schnellstmöglich bei Ihnen.',
  ContactErrorTitle: 'Ihre Nachricht konnte nicht gesendet werden',
  ContactErrorText:
    'Bitte versuchen Sie es noch einmal oder schreiben Sie uns direkt an {email}.',
  ContactClose: 'Schließen',

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
    'Alle Rechte vorbehalten. © {year} Netsnek e.U.',
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
  NotFoundBackHome: 'Zur Startseite',

  /**
   * The texts of the home page and the footer.
   *
   * A key named after a CMS field is that field's default (see useFieldText in
   * src/contexts/locale.tsx), and jaen-data/build-patch-i18n.mjs writes its
   * translations into the localized pages as stored CMS content. The other
   * keys are plain interface strings. German is the source, word for word as
   * the components carried it; the translations render it faithfully and add
   * no names, facts or claims.
   */
  // Home page: hero (src/components/sections/Hero.tsx)
  HeroBadgeTag: 'Für dich',
  HeroBadgeText: 'Kostenlose Erstberatung',
  HeroSectionHeading: 'Lass dich von <br/>mir beraten',
  HeroSectionText: [
    'Entdecke mit mir die Welt der IT-Dienstleistungen. 💻🚀 Als professioneller IT-Berater helfe ich dir dabei, deine technischen Herausforderungen zu meistern. 🎯 Meine Spezialgebiete sind Security und Cloudcomputing. ⛅🔒 ',
    'Auf der Suche nach einer Optimierung deines Systems?',
    'Lass dich von mir beraten! 🤝 Erfahrung, Leidenschaft und technisches Know-how aus Österreich. Und ja, ich finde immer eine Lösung (aber ich empfehle, das Problem nicht selbst zu lösen 😉).'
  ].join('<br/><br/>'),
  HeroContactButton: 'Kontaktiere mich',

  // Home page: welcome and partners (src/pages/index.tsx)
  ContentSectionHeading: 'Willkommen! 🙌',
  ContentSectionText: [
    'Es war schon immer meine Leidenschaft, eigene Unternehmen zu leiten und mit Technologie zu jonglieren. Heute möchte ich mit dir darüber sprechen – von den Anfängen bis zur aktuellen Realität und der Zukunft, die wir gerade gestalten. 🚀',
    'Meine Reise in die faszinierende Welt der Informationstechnologie begann mit der Gründung von Florian Herbert Kleber IT am 21.07.2020. Getrieben von meiner Leidenschaft✨, wollte ich den Bedarf an qualitativ hochwertigen und maßgeschneiderten IT-Dienstleistungen erfüllen. Daher gründete ich dieses Unternehmen in Villach, doch schon bald werden wir unseren Firmensitz nach Wien verlegen. 📦💼',
    'Mein Fokus liegt immer auf Cyber-Security 🔒, Cloud-Diensten ☁️ und Softwareentwicklung 🎨, stets darauf bedacht, die besten Lösungen für meine Kunden zu bieten. 🙌 Mein Berufszweig ermöglicht es mir, für eine Vielzahl von Branchen zu arbeiten, immer auf der Suche nach den besten IT-Lösungen für jedes einzelne Unternehmen.',
    'Auf dieser wunderbaren Reise hatten wir die Chance, unglaubliche Projekte zu verwirklichen, zusammen mit einigen der besten Experten in meinem Netzwerk. 🌐 Eines meiner liebsten Projekte war die Zusammenarbeit mit einem meiner Partner zur Entwicklung eines erfolgreichen ERP-Systems namens "Jaen". 😎',
    'Ich ruhe mich aber nicht auf meinen Lorbeeren aus. Mein Unternehmen ist stets bemüht, sich weiterzuentwickeln und unser Angebot zu verfeinern. Deshalb freue ich mich, dir einen kleinen Vorgeschmack auf meine kommenden Unternehmungen geben zu können... 😉',
    'Wir planen die Gründung eines neuen Unternehmens für die Entwicklung von Enterprise-Software! Es ist eine aufregende Zeit und wir sind bereit, neue Meilensteine zu setzen. 💡🎯',
    'Es ist erstaunlich zu sehen, wie weit Florian Herbert Kleber IT gekommen ist und ich freue mich auf das, was noch kommen wird. Unsere Arbeit ist unsere Leidenschaft und wir geben immer unser Bestes, um der IT-Welt das Beste von uns zu geben.',
    'Ich danke dir, dass du mich auf dieser spannenden Reise begleitest und wir können es kaum erwarten, dir zu zeigen, was als Nächstes kommt! 🚀',
    'Behalte also unsere Updates im Auge. Bis dahin, bleib sicher und digital! 😉',
    '- Florian'
  ].join('<br/><br/>'),
  ContentSectionHeadingTeam: 'Partner 🤝',
  ContentSectionTextTeam:
    'Ich biete branchenübergreifende Kundenberatung und -betreuung mit Unterstützung von Experten aus meinem umfassenden Netzwerk. In Zusammenarbeit mit meinen Partnern gewährleisten wir ein breites Angebot an Dienstleistungen. Mein Ziel ist es, gemeinsam mit dir alle deine technologischen Herausforderungen zu meistern. 💪🚀',
  PartnerSoftwareHeading: 'Software Entwicklung',
  ContentSectionTextTeam1:
    'Als JavaScript-Großmeister🎯 und Open-Source-Veteran⚡, mit starker Cyber-Security-Grundlage🔒, liegt meine Expertise in der Webentwicklung und im Aufbau hochwirksamer ERP-Systeme ⚙️. Die erfolgreiche Entwicklung eines gemeinsamen ERP-Systems namens "Jaen"✨, zusammen mit Florian Herbert Kleber IT, unterstreicht meine Fähigkeit, proaktiv und lösungsorientiert zu handeln. Als technischer Zauberer🧙\u200d♂️💻 bin ich stets bereit, Probleme zu bewältigen, bevor sie entstehen, und schaffe damit ein reibungsloses technologisches Erlebnis.',
  PartnerElectricalHeading: 'Elektrotechnik',
  ContentSectionTextTeam2:
    'Ich kombiniere mein Masterstudium in Elektrotechnik⚡️ und Informationstechnik📡 mit hingebungsvoller Arbeit an Technik jeder Art. Besondere Leidenschaft habe ich für das Programmieren von Cloudsystemen, Websites und der Instandhaltung von Computern. Mit ständiger Faszination betreibe ich Server und Netzwerke. Vereinfachen und effizient machen - das ist mein Credo! 💪🚀',
  PartnerDesignHeading: 'Design & Marketing',
  ContentSectionTextTeam3:
    'Wir sind eine kreative 🎨 Werbeagentur in der charmanten Stadt Villach. Zusammen mit Florian Herbert Kleber IT arbeiten wir daran, moderne, stilvolle und wirkungsvolle Online-Auftritte zu gestalten.',
  MapSectionHeading: 'Büroräume 📦💼',

  // Footer (src/components/sections/Footer.tsx)
  FooterTitleLine1: 'Danke für deinen Besuch!',
  FooterTextNew:
    'Löwengasse 14 / Lokal 2 <br>1030 Wien <br>Austria <br><br>Email: office@fhkit.at<br>Tel: +43 650 824 88 11',
  FooterLinkTitleLinks: 'Links',
  FooterLinkImpressum: 'Impressum',
  FooterLinkTitlePartner: 'Partner',
  FooterLinkTitleDesignedBy: 'Gestaltet von'
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

  ContactSuccessTitle: 'Your message has been sent',
  ContactSuccessText: 'Thank you! We will get back to you as soon as we can.',
  ContactErrorTitle: 'Your message could not be sent',
  ContactErrorText: 'Please try again, or write to us directly at {email}.',
  ContactClose: 'Close',

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
  MailConfirmRights: 'All rights reserved. © {year} Netsnek e.U.',
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
  NotFoundBackHome: 'Go to the home page',

  HeroBadgeTag: 'For you',
  HeroBadgeText: 'Free initial consultation',
  HeroSectionHeading: 'Let me <br/>advise you',
  HeroSectionText: [
    'Discover the world of IT services with me. 💻🚀 As a professional IT consultant, I help you master your technical challenges. 🎯 My specialities are security and cloud computing. ⛅🔒 ',
    'Looking to optimise your system?',
    'Let me advise you! 🤝 Experience, passion and technical know-how from Austria. And yes, I always find a solution (but I recommend not trying to solve the problem yourself 😉).'
  ].join('<br/><br/>'),
  HeroContactButton: 'Contact me',
  ContentSectionHeading: 'Welcome! 🙌',
  ContentSectionText: [
    'It has always been my passion to run my own businesses and to juggle technology. Today I would like to talk to you about it – from the beginnings to the present reality and the future we are shaping right now. 🚀',
    'My journey into the fascinating world of information technology began with the founding of Florian Herbert Kleber IT on 21 July 2020. Driven by my passion✨, I wanted to meet the demand for high-quality, tailor-made IT services. That is why I founded this company in Villach, but we will soon be moving our headquarters to Vienna. 📦💼',
    'My focus is always on cyber security 🔒, cloud services ☁️ and software development 🎨, always intent on offering my clients the best solutions. 🙌 My line of work allows me to work for a wide range of industries, always looking for the best IT solutions for each individual company.',
    'On this wonderful journey we have had the chance to bring incredible projects to life, together with some of the best experts in my network. 🌐 One of my favourite projects was working with one of my partners on the development of a successful ERP system called "Jaen". 😎',
    'But I am not resting on my laurels. My company is always striving to develop further and to refine what we offer. That is why I am glad to give you a little foretaste of my upcoming ventures... 😉',
    'We are planning to found a new company for the development of enterprise software! It is an exciting time, and we are ready to set new milestones. 💡🎯',
    'It is amazing to see how far Florian Herbert Kleber IT has come, and I am looking forward to what is still to come. Our work is our passion, and we always do our best to give the IT world the best of us.',
    'Thank you for accompanying me on this exciting journey, and we can hardly wait to show you what comes next! 🚀',
    'So keep an eye on our updates. Until then, stay safe and digital! 😉',
    '- Florian'
  ].join('<br/><br/>'),
  ContentSectionHeadingTeam: 'Partners 🤝',
  ContentSectionTextTeam:
    'I offer cross-industry client consulting and support, backed by experts from my extensive network. Together with my partners, we ensure a broad range of services. My goal is to master all your technological challenges together with you. 💪🚀',
  PartnerSoftwareHeading: 'Software development',
  ContentSectionTextTeam1:
    'As a JavaScript grandmaster🎯 and open-source veteran⚡ with a strong cyber security foundation🔒, my expertise lies in web development and in building highly effective ERP systems ⚙️. The successful development of a joint ERP system called "Jaen"✨, together with Florian Herbert Kleber IT, underlines my ability to act proactively and with a focus on solutions. As a technical wizard🧙\u200d♂️💻 I am always ready to tackle problems before they arise, creating a seamless technological experience.',
  PartnerElectricalHeading: 'Electrical engineering',
  ContentSectionTextTeam2:
    'I combine my master’s studies in electrical engineering⚡️ and information technology📡 with dedicated work on technology of every kind. I am particularly passionate about programming cloud systems and websites and about maintaining computers. I run servers and networks with constant fascination. Simplify and make efficient - that is my credo! 💪🚀',
  PartnerDesignHeading: 'Design & marketing',
  ContentSectionTextTeam3:
    'We are a creative 🎨 advertising agency in the charming town of Villach. Together with Florian Herbert Kleber IT, we work on creating modern, stylish and effective online presences.',
  MapSectionHeading: 'Offices 📦💼',
  FooterTitleLine1: 'Thank you for your visit!',
  FooterTextNew:
    'Löwengasse 14 / Lokal 2 <br>1030 Wien <br>Austria <br><br>Email: office@fhkit.at<br>Tel: +43 650 824 88 11',
  FooterLinkTitleLinks: 'Links',
  FooterLinkImpressum: 'Legal notice',
  FooterLinkTitlePartner: 'Partners',
  FooterLinkTitleDesignedBy: 'Designed by'
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

  ContactSuccessTitle: 'Vaše sporočilo je bilo poslano',
  ContactSuccessText: 'Hvala! Javili se vam bomo v najkrajšem možnem času.',
  ContactErrorTitle: 'Vašega sporočila ni bilo mogoče poslati',
  ContactErrorText: 'Poskusite znova ali nam pišite neposredno na {email}.',
  ContactClose: 'Zapri',

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
    'Vse pravice pridržane. © {year} Netsnek e.U.',
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
  NotFoundBackHome: 'Na domačo stran',

  HeroBadgeTag: 'Zate',
  HeroBadgeText: 'Brezplačen uvodni posvet',
  HeroSectionHeading: 'Naj ti <br/>svetujem',
  HeroSectionText: [
    'Odkrij z menoj svet storitev IT. 💻🚀 Kot profesionalni svetovalec za IT ti pomagam obvladati tvoje tehnične izzive. 🎯 Moji specialnosti sta varnost in računalništvo v oblaku. ⛅🔒 ',
    'Iščeš način za optimizacijo svojega sistema?',
    'Naj ti svetujem! 🤝 Izkušnje, strast in tehnično znanje iz Avstrije. In ja, vedno najdem rešitev (a priporočam ti, da težave ne rešuješ sam 😉).'
  ].join('<br/><br/>'),
  HeroContactButton: 'Kontaktiraj me',
  ContentSectionHeading: 'Dobrodošli! 🙌',
  ContentSectionText: [
    'Vedno je bila moja strast voditi lastna podjetja in žonglirati s tehnologijo. Danes bi se rad s tabo pogovoril o tem – od začetkov do današnje resničnosti in prihodnosti, ki jo prav zdaj oblikujemo. 🚀',
    'Moja pot v fascinanten svet informacijske tehnologije se je začela z ustanovitvijo podjetja Florian Herbert Kleber IT 21. 7. 2020. Gnan s strastjo✨ sem želel zadostiti potrebi po kakovostnih in po meri izdelanih storitvah IT. Zato sem to podjetje ustanovil v Beljaku, a kmalu bomo sedež podjetja preselili na Dunaj. 📦💼',
    'Moj poudarek je vedno na kibernetski varnosti 🔒, storitvah v oblaku ☁️ in razvoju programske opreme 🎨, pri čemer si vedno prizadevam strankam ponuditi najboljše rešitve. 🙌 Moj poklic mi omogoča delo za najrazličnejše panoge, vedno v iskanju najboljših rešitev IT za vsako posamezno podjetje.',
    'Na tej čudoviti poti smo imeli priložnost uresničiti neverjetne projekte, skupaj z nekaterimi najboljšimi strokovnjaki iz moje mreže. 🌐 Eden mojih najljubših projektov je bilo sodelovanje z enim od mojih partnerjev pri razvoju uspešnega sistema ERP z imenom »Jaen«. 😎',
    'Vendar ne počivam na lovorikah. Moje podjetje si nenehno prizadeva za nadaljnji razvoj in izpopolnjevanje naše ponudbe. Zato sem vesel, da ti lahko ponudim majhen predokus mojih prihodnjih podvigov... 😉',
    'Načrtujemo ustanovitev novega podjetja za razvoj poslovne programske opreme! To je vznemirljiv čas in pripravljeni smo postaviti nove mejnike. 💡🎯',
    'Neverjetno je videti, kako daleč je prišlo podjetje Florian Herbert Kleber IT, in veselim se vsega, kar še prihaja. Naše delo je naša strast in vedno damo vse od sebe, da bi svetu IT dali najboljše od sebe.',
    'Hvala ti, da me spremljaš na tej razburljivi poti, in komaj čakamo, da ti pokažemo, kaj sledi! 🚀',
    'Zato spremljaj naše novice. Do takrat pa ostani varen in digitalen! 😉',
    '- Florian'
  ].join('<br/><br/>'),
  ContentSectionHeadingTeam: 'Partnerji 🤝',
  ContentSectionTextTeam:
    'Ponujam medpanožno svetovanje in podporo strankam ob pomoči strokovnjakov iz moje obsežne mreže. V sodelovanju s svojimi partnerji zagotavljamo široko ponudbo storitev. Moj cilj je, da skupaj s tabo obvladamo vse tvoje tehnološke izzive. 💪🚀',
  PartnerSoftwareHeading: 'Razvoj programske opreme',
  ContentSectionTextTeam1:
    'Kot velemojster JavaScripta🎯 in veteran odprte kode⚡ s trdnimi temelji v kibernetski varnosti🔒 imam strokovno znanje na področju spletnega razvoja in gradnje zelo učinkovitih sistemov ERP ⚙️. Uspešen razvoj skupnega sistema ERP z imenom »Jaen«✨, skupaj s podjetjem Florian Herbert Kleber IT, poudarja mojo sposobnost proaktivnega in k rešitvam usmerjenega delovanja. Kot tehnični čarovnik🧙\u200d♂️💻 sem vedno pripravljen obvladati težave, preden nastanejo, in tako ustvarjam brezhibno tehnološko izkušnjo.',
  PartnerElectricalHeading: 'Elektrotehnika',
  ContentSectionTextTeam2:
    'Svoj magistrski študij elektrotehnike⚡️ in informacijske tehnologije📡 združujem s predanim delom na tehniki vseh vrst. Posebno strast gojim do programiranja sistemov v oblaku in spletnih strani ter do vzdrževanja računalnikov. Z nenehnim navdušenjem upravljam strežnike in omrežja. Poenostaviti in narediti učinkovito - to je moj kredo! 💪🚀',
  PartnerDesignHeading: 'Oblikovanje in trženje',
  ContentSectionTextTeam3:
    'Smo kreativna 🎨 oglaševalska agencija v očarljivem mestu Beljak. Skupaj s podjetjem Florian Herbert Kleber IT si prizadevamo oblikovati sodobne, elegantne in učinkovite spletne predstavitve.',
  MapSectionHeading: 'Poslovni prostori 📦💼',
  FooterTitleLine1: 'Hvala za tvoj obisk!',
  FooterTextNew:
    'Löwengasse 14 / Lokal 2 <br>1030 Wien <br>Avstrija <br><br>E-pošta: office@fhkit.at<br>Tel.: +43 650 824 88 11',
  FooterLinkTitleLinks: 'Povezave',
  FooterLinkImpressum: 'Impresum',
  FooterLinkTitlePartner: 'Partnerji',
  FooterLinkTitleDesignedBy: 'Oblikoval'
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

  ContactSuccessTitle: 'Il tuo messaggio è stato inviato',
  ContactSuccessText: 'Grazie! Ti risponderemo al più presto.',
  ContactErrorTitle: 'Non è stato possibile inviare il tuo messaggio',
  ContactErrorText: 'Riprova oppure scrivici direttamente a {email}.',
  ContactClose: 'Chiudi',

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
    'Tutti i diritti riservati. © {year} Netsnek e.U.',
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
  NotFoundBackHome: 'Vai alla home page',

  HeroBadgeTag: 'Per te',
  HeroBadgeText: 'Primo colloquio gratuito',
  HeroSectionHeading: 'Lasciati <br/>consigliare da me',
  HeroSectionText: [
    'Scopri con me il mondo dei servizi IT. 💻🚀 Come consulente IT professionista ti aiuto a superare le tue sfide tecniche. 🎯 Le mie specialità sono la sicurezza e il cloud computing. ⛅🔒 ',
    'Cerchi un modo per ottimizzare il tuo sistema?',
    'Lasciati consigliare da me! 🤝 Esperienza, passione e know-how tecnico dall’Austria. E sì, trovo sempre una soluzione (ma ti consiglio di non risolvere il problema da solo 😉).'
  ].join('<br/><br/>'),
  HeroContactButton: 'Contattami',
  ContentSectionHeading: 'Benvenuti! 🙌',
  ContentSectionText: [
    'È sempre stata la mia passione guidare le mie aziende e destreggiarmi con la tecnologia. Oggi vorrei parlartene – dagli inizi alla realtà attuale e al futuro che stiamo plasmando proprio ora. 🚀',
    'Il mio viaggio nell’affascinante mondo della tecnologia dell’informazione è iniziato con la fondazione di Florian Herbert Kleber IT il 21 luglio 2020. Spinto dalla mia passione✨, volevo rispondere alla domanda di servizi IT di alta qualità e su misura. Per questo ho fondato questa azienda a Villach, ma presto trasferiremo la nostra sede a Vienna. 📦💼',
    'Mi concentro sempre su cyber security 🔒, servizi cloud ☁️ e sviluppo software 🎨, sempre attento a offrire ai miei clienti le soluzioni migliori. 🙌 Il mio ambito professionale mi permette di lavorare per un’ampia varietà di settori, sempre alla ricerca delle migliori soluzioni IT per ogni singola azienda.',
    'In questo meraviglioso viaggio abbiamo avuto l’opportunità di realizzare progetti incredibili, insieme ad alcuni dei migliori esperti della mia rete. 🌐 Uno dei miei progetti preferiti è stata la collaborazione con uno dei miei partner per lo sviluppo di un sistema ERP di successo chiamato "Jaen". 😎',
    'Ma non mi adagio sugli allori. La mia azienda si impegna costantemente a crescere e a perfezionare la nostra offerta. Per questo sono felice di poterti dare un piccolo assaggio delle mie prossime iniziative... 😉',
    'Stiamo pianificando la fondazione di una nuova azienda per lo sviluppo di software enterprise! È un periodo entusiasmante e siamo pronti a raggiungere nuovi traguardi. 💡🎯',
    'È sorprendente vedere quanta strada abbia fatto Florian Herbert Kleber IT e non vedo l’ora di vedere cosa verrà. Il nostro lavoro è la nostra passione e diamo sempre il massimo per offrire al mondo IT il meglio di noi.',
    'Ti ringrazio di accompagnarmi in questo viaggio emozionante e non vediamo l’ora di mostrarti cosa verrà dopo! 🚀',
    'Quindi tieni d’occhio i nostri aggiornamenti. Fino ad allora, resta al sicuro e digitale! 😉',
    '- Florian'
  ].join('<br/><br/>'),
  ContentSectionHeadingTeam: 'Partner 🤝',
  ContentSectionTextTeam:
    'Offro consulenza e assistenza ai clienti in tutti i settori, con il supporto di esperti della mia ampia rete. In collaborazione con i miei partner garantiamo un’ampia gamma di servizi. Il mio obiettivo è superare insieme a te tutte le tue sfide tecnologiche. 💪🚀',
  PartnerSoftwareHeading: 'Sviluppo software',
  ContentSectionTextTeam1:
    'Come gran maestro di JavaScript🎯 e veterano dell’open source⚡, con solide basi di cyber security🔒, la mia competenza è nello sviluppo web e nella realizzazione di sistemi ERP altamente efficaci ⚙️. Lo sviluppo di successo di un sistema ERP comune chiamato "Jaen"✨, insieme a Florian Herbert Kleber IT, sottolinea la mia capacità di agire in modo proattivo e orientato alle soluzioni. Come mago della tecnologia🧙\u200d♂️💻 sono sempre pronto ad affrontare i problemi prima che si presentino, creando così un’esperienza tecnologica senza intoppi.',
  PartnerElectricalHeading: 'Ingegneria elettrica',
  ContentSectionTextTeam2:
    'Unisco il mio corso di laurea magistrale in ingegneria elettrica⚡️ e tecnologia dell’informazione📡 a un lavoro appassionato sulla tecnologia di ogni genere. Ho una passione particolare per la programmazione di sistemi cloud e siti web e per la manutenzione dei computer. Gestisco server e reti, che non smettono mai di affascinarmi. Semplificare e rendere efficiente - questo è il mio credo! 💪🚀',
  PartnerDesignHeading: 'Design e marketing',
  ContentSectionTextTeam3:
    'Siamo un’agenzia pubblicitaria creativa 🎨 nell’affascinante città di Villach. Insieme a Florian Herbert Kleber IT lavoriamo per creare presenze online moderne, eleganti ed efficaci.',
  MapSectionHeading: 'Uffici 📦💼',
  FooterTitleLine1: 'Grazie per la tua visita!',
  FooterTextNew:
    'Löwengasse 14 / Lokal 2 <br>1030 Wien <br>Austria <br><br>E-mail: office@fhkit.at<br>Tel.: +43 650 824 88 11',
  FooterLinkTitleLinks: 'Link',
  FooterLinkImpressum: 'Note legali',
  FooterLinkTitlePartner: 'Partner',
  FooterLinkTitleDesignedBy: 'Progettato da'
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

  ContactSuccessTitle: 'メッセージを送信しました',
  ContactSuccessText: 'ありがとうございます。できるかぎり早くご返信いたします。',
  ContactErrorTitle: 'メッセージを送信できませんでした',
  ContactErrorText:
    'お手数ですが、もう一度お試しいただくか、{email} まで直接メールでお送りください。',
  ContactClose: '閉じる',

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
  MailConfirmRights: '無断転載を禁じます。© {year} Netsnek e.U.',
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
  NotFoundBackHome: 'ホームページへ',

  HeroBadgeTag: 'あなたへ',
  HeroBadgeText: '初回相談無料',
  HeroSectionHeading: '私に<br/>ご相談ください',
  HeroSectionText: [
    'IT サービスの世界を私と一緒に探ってみませんか。💻🚀 プロの IT コンサルタントとして、あなたが技術的な課題を乗り越えられるようお手伝いします。🎯 専門分野はセキュリティとクラウドコンピューティングです。⛅🔒 ',
    'システムの最適化をお考えですか？',
    'ぜひ私にご相談ください！🤝 オーストリア発の経験、情熱、そして技術的なノウハウ。そう、解決策はいつでも見つけます（ただし、問題をご自身で解決しようとはしないことをおすすめします 😉）。'
  ].join('<br/><br/>'),
  HeroContactButton: 'お問い合わせ',
  ContentSectionHeading: 'ようこそ！🙌',
  ContentSectionText: [
    '自分の会社を経営し、テクノロジーを自在に操ることは、ずっと私の情熱でした。今日はそのことについてお話ししたいと思います。始まりから現在の姿、そして私たちが今まさに形づくっている未来まで。🚀',
    '情報技術という魅力的な世界への私の旅は、2020年7月21日の Florian Herbert Kleber IT の創業とともに始まりました。情熱✨に突き動かされ、高品質でオーダーメイドの IT サービスへのニーズに応えたいと考えました。そこでこの会社をフィラッハで創業しましたが、まもなく本社をウィーンに移す予定です。📦💼',
    '私が常に重視しているのは、サイバーセキュリティ 🔒、クラウドサービス ☁️、ソフトウェア開発 🎨 です。お客様に最善のソリューションを提供することを常に心がけています。🙌 この職業のおかげで、さまざまな業界のために仕事をすることができ、一社一社にとって最適な IT ソリューションを常に追い求めています。',
    'この素晴らしい旅の中で、私のネットワークでも屈指の専門家たちとともに、信じられないようなプロジェクトを実現する機会に恵まれました。🌐 特に気に入っているプロジェクトのひとつは、パートナーの一人と協力して「Jaen」という成功した ERP システムを開発したことです。😎',
    'とはいえ、これまでの成果に満足して立ち止まるつもりはありません。私の会社は常に成長し、サービスを磨き続けることに努めています。そこで、今後の取り組みについて少しだけご紹介できることを嬉しく思います… 😉',
    'エンタープライズソフトウェアの開発を手がける新しい会社の設立を計画しています！わくわくする時期であり、新たなマイルストーンを打ち立てる準備はできています。💡🎯',
    'Florian Herbert Kleber IT がここまで成長したことに驚くとともに、これから訪れるものを楽しみにしています。仕事は私たちの情熱であり、IT の世界に私たちの最高のものを届けるため、常に全力を尽くしています。',
    'このわくわくする旅にご一緒いただき、ありがとうございます。次に何が待っているのか、お見せできる日が待ちきれません！🚀',
    'ぜひ今後の最新情報にご注目ください。それまで、安全に、そしてデジタルにお過ごしください！😉',
    '- Florian'
  ].join('<br/><br/>'),
  ContentSectionHeadingTeam: 'パートナー 🤝',
  ContentSectionTextTeam:
    '私の幅広いネットワークに属する専門家の支援を受けながら、業界を問わずお客様へのコンサルティングとサポートを提供しています。パートナーと協力し、幅広いサービスをお約束します。私の目標は、あなたと一緒にあらゆる技術的な課題を乗り越えることです。💪🚀',
  PartnerSoftwareHeading: 'ソフトウェア開発',
  ContentSectionTextTeam1:
    'JavaScript のグランドマスター🎯でありオープンソースのベテラン⚡として、サイバーセキュリティの確かな基礎🔒を持ち、Web 開発と効果の高い ERP システムの構築⚙️を専門としています。Florian Herbert Kleber IT と共同で「Jaen」✨という ERP システムの開発に成功したことは、主体的かつ解決志向で行動できる私の力を示しています。技術の魔法使い🧙\u200d♂️💻として、問題が起こる前に対処する準備を常に整え、スムーズなテクノロジー体験を生み出します。',
  PartnerElectricalHeading: '電気工学',
  ContentSectionTextTeam2:
    '電気工学⚡️と情報技術📡の修士課程での学びを、あらゆる技術への献身的な取り組みと組み合わせています。特に情熱を注いでいるのは、クラウドシステムや Web サイトのプログラミング、そしてコンピューターのメンテナンスです。尽きることのない魅力を感じながら、サーバーとネットワークを運用しています。シンプルに、そして効率的に - それが私のモットーです！💪🚀',
  PartnerDesignHeading: 'デザイン＆マーケティング',
  ContentSectionTextTeam3:
    '私たちは、魅力あふれる街フィラッハにあるクリエイティブ🎨な広告代理店です。Florian Herbert Kleber IT とともに、モダンでスタイリッシュ、そして効果的なオンラインプレゼンスづくりに取り組んでいます。',
  MapSectionHeading: 'オフィス 📦💼',
  FooterTitleLine1: 'ご訪問ありがとうございます！',
  FooterTextNew:
    'Löwengasse 14 / Lokal 2 <br>1030 Wien <br>オーストリア <br><br>メール: office@fhkit.at<br>電話: +43 650 824 88 11',
  FooterLinkTitleLinks: 'リンク',
  FooterLinkImpressum: '法的表示',
  FooterLinkTitlePartner: 'パートナー',
  FooterLinkTitleDesignedBy: 'デザイン'
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
