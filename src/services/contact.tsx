import { sendTemplateMail } from "gatsby-jaen-emailwerk";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { RouteComponentProps } from "@reach/router";

import {
  ContactFormValues,
  ContactModal,
  ContactSendResult,
} from "../components/ContactModal/ContactModal";
import { useAuth } from "jaen";
import { useQueryRouter } from "../hooks/use-query-router";

/**
 * fhkit's own "fhkit Contact" template in emailwerk, the one the form posts to.
 *
 * It is public and delivers to office@fhkit.at, the inbox stored on the
 * template. Its child "fhkit Contact Confirmation" (cmv2fl2pd14ekps2peogq6lq1)
 * is what emailwerk sends to the visitor. Both were created on 2026-10-10, and
 * https://fhkit.at has been an allowed origin since then. The details are in
 * docs/emailwerk-setup.md.
 *
 * The id is neither a secret nor an authorization. It used to be netsnek.com's
 * Contact template, which would have delivered every fhkit enquiry to netsnek's
 * inbox, so the form opened a prefilled mail to {@link CONTACT_EMAIL} until
 * fhkit's own template existed.
 */
const CONTACT_TEMPLATE_ID = 'cmv2fl2cu14ebps2p05nwpoev';

/** The site's own mailbox, as the footer and the legal notice give it. */
const CONTACT_EMAIL = 'office@fhkit.at';

/**
 * The inline style the confirmation template gives its links.
 *
 * Email clients drop stylesheets, so it has to ride along on every anchor. It
 * lives here once because the sentence around the links is translated and the
 * word order moves with the language.
 */
const MAIL_LINK_STYLE =
  '-webkit-text-size-adjust:none;-ms-text-size-adjust:none;' +
  'mso-line-height-rule:exactly;text-decoration:underline;' +
  'color:#5c68e2;font-size:14px;';

const mailLink = (href: string, label: string) =>
  `<a href="${href}" target="_new" style="${MAIL_LINK_STYLE}">${label}</a>`;

/**
 * The confirmation mail, in the language the visitor filled the form in.
 *
 * emailwerk delivers the confirmation as a linked child of the contact template
 * and renders it server-side from the SAME values the contact send carried, so
 * the only way the sender's language reaches that mail is to send the text with
 * it. Each `t_` key matches a placeholder in the template, and every
 * placeholder there keeps the German original as its own fallback: an older
 * build that sends none of this still produces a correct German mail.
 */
const confirmationText = (intl: ReturnType<typeof useIntl>) => ({
  locale: intl.locale,
  t_subject: intl.formatMessage({
    id: 'MailConfirmSubject',
    defaultMessage: 'Ihre Anfrage auf fhkit.at'
  }),
  t_title: intl.formatMessage({
    id: 'MailConfirmTitle',
    defaultMessage: 'Ihre Anfrage'
  }),
  t_heading: intl.formatMessage({
    id: 'MailConfirmHeading',
    defaultMessage: 'Kontaktanfrage'
  }),
  t_thanks: intl.formatMessage({
    id: 'MailConfirmThanks',
    defaultMessage:
      'Vielen Dank für Ihre Kontaktanfrage. Ich melde mich so schnell wie möglich bei Ihnen.'
  }),
  t_labelName: intl.formatMessage({
    id: 'MailConfirmLabelName',
    defaultMessage: 'Name:'
  }),
  t_labelEmail: intl.formatMessage({
    id: 'MailConfirmLabelEmail',
    defaultMessage: 'E-Mail:'
  }),
  t_labelPhone: intl.formatMessage({
    id: 'MailConfirmLabelPhone',
    defaultMessage: 'Telefonnummer:'
  }),
  t_labelMessage: intl.formatMessage({
    id: 'MailConfirmLabelMessage',
    defaultMessage: 'Nachricht:'
  }),
  // The only string that carries markup. The template renders it raw, so the
  // two links are built here rather than left as bare text.
  t_questions: intl.formatMessage(
    {
      id: 'MailConfirmQuestions',
      defaultMessage:
        'Haben Sie noch Fragen? Dann schreiben Sie mir gerne an {mail} oder rufen Sie mich unter {phone} an.'
    },
    {
      mail: mailLink('mailto:office@fhkit.at', 'office@fhkit.at'),
      phone: mailLink('tel:+436508248811', '+43 650 824 88 11')
    }
  ),
  t_rights: intl.formatMessage(
    {
      id: 'MailConfirmRights',
      defaultMessage:
        'Alle Rechte vorbehalten. © {year} Florian Herbert Kleber IT'
    },
    // The year belongs inside the string, not around it: English and Japanese
    // both put the symbol first, and only the string knows its own order.
    { year: String(new Date().getFullYear()) }
  ),
  t_website: intl.formatMessage({
    id: 'MailConfirmWebsite',
    defaultMessage: 'Webseite'
  }),
  t_imprint: intl.formatMessage({
    id: 'MailConfirmImprint',
    defaultMessage: 'Impressum'
  })
});

/**
 * A mail to {@link CONTACT_EMAIL} with the enquiry already written out,
 * labelled in the language the form was filled in.
 *
 * The dialog links it when a send fails, so emailwerk being out of reach never
 * makes the form a dead end. It is what the form opened for every enquiry
 * before fhkit had its own template.
 */
const enquiryMailto = (
  data: ContactFormValues,
  text: ReturnType<typeof confirmationText>
) => {
  const name = `${data.firstName} ${data.lastName}`.trim();

  const lines = [
    `${text.t_labelName} ${name}`,
    `${text.t_labelEmail} ${data.email}`
  ];

  if (data.phone) lines.push(`${text.t_labelPhone} ${data.phone}`);

  lines.push('', text.t_labelMessage, data.message.replace(/\r?\n/g, '\r\n'));

  // RFC 6068 asks for CRLF line breaks in a mailto body, the visitor's own
  // ones in the message included.
  return (
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent(`${text.t_heading}: ${name}`)}` +
    `&body=${encodeURIComponent(lines.join('\r\n'))}`
  );
};

export interface ContactModalContextProps {
  onOpen: (args?: { meta?: Record<string, any> }) => void;
  onClose: () => void;
}

export const ContactModalContext =
  React.createContext<ContactModalContextProps>({
    onOpen: () => {},
    onClose: () => {},
  });

export const useContactModal = () => {
  if (!ContactModalContext) {
    throw new Error(
      "useContactModal must be used within a ContactModalProvider"
    );
  }

  return React.useContext(ContactModalContext);
};

export interface ContactModalDrawerProps {
  children: React.ReactNode;
  location: {
    pathname: string;
    search: string;
  };
}

export const ContactModalProvider: React.FC<ContactModalDrawerProps> = ({
  location,
  children,
}) => {
  const { isCalled, paramValue } = useQueryRouter(location, "contact");

  const [meta, setMeta] = React.useState<Record<string, any> | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (isCalled) {
      setIsOpen(true);
      //alert(paramValue)
    }
  }, [isCalled]);

  const intl = useIntl();

  const authentication = useAuth();

  const onOpen: ContactModalContextProps["onOpen"] = (args) => {
    const updatedMeta = {
      ...meta,
      url: window.location.href,
    };

    setMeta(updatedMeta);
    setIsOpen(true);
  };
  const onClose = () => {
    //navigate(location.pathname);

    setIsOpen(false);
  };

  /**
   * Sends the enquiry and tells the dialog how it went. The dialog shows the
   * outcome itself, in the page's language, where a toast used to say "Fehler"
   * or "Erfolg" for five seconds. A failure keeps the dialog open with what
   * the visitor typed and offers the same enquiry as a mail.
   */
  const onSubmit = async (
    data: ContactFormValues
  ): Promise<ContactSendResult> => {
    const text = confirmationText(intl);

    // The "fhkit Contact" template on emailwerk, flagged isPublic, so this
    // posts anonymously when there is no CMS session and emailwerk takes its
    // public branch. Recipients come from the template's stored envelope
    // server-side and cannot be passed from here at all. `replyTo` is the only
    // override an anonymous caller is allowed, and it is also the address
    // emailwerk delivers the linked confirmation template to. Sending that
    // confirmation from here would deliver it twice.
    const result = await sendTemplateMail(CONTACT_TEMPLATE_ID, {
      envelope: {
        replyTo: data.email
      },
      values: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || '',
        message: data.message,
        // The office mail links the page the enquiry came from. `meta` is only
        // set when a button opened the dialog, so the address is read here as
        // well rather than left empty.
        invokedOnUrl: meta?.url ?? window.location.href,
        ...text
      }
    });

    if (result.ok) {
      return { ok: true };
    }

    return {
      ok: false,
      mailbox: CONTACT_EMAIL,
      mailto: enquiryMailto(data, text)
    };
  };

  const fixedValues = useMemo(() => {
    if (!authentication.user) {
      return undefined;
    }

    return {
      // `profile` is optional on jaen v3's user: the provider hands back a
      // user object before the OIDC profile has been resolved, and the static
      // build renders in exactly that state.
      firstName: authentication.user.profile?.given_name,
      lastName: authentication.user.profile?.family_name,
      email: authentication.user.profile?.email,
    };
  }, [authentication.user]);

  const defaultValues = useMemo(() => {
    if (!isCalled) {
      return undefined;
    }

    return {
      message: paramValue,
    };
  }, [isCalled, paramValue]);

  return (
    <ContactModalContext.Provider value={{ onOpen, onClose }}>
      {children}
      <ContactModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        fixedValues={fixedValues}
        defaultValues={defaultValues}
      />
    </ContactModalContext.Provider>
  );
};
