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
 * The GraphQL endpoint of emailwerk. The jaen emailwerk plugin gets the same
 * address in gatsby-config.ts for the CMS pages, so the two change together.
 */
const EMAILWERK_URL = 'https://emailwerk.com/graphql';

/**
 * The mutation the form posts, and nothing beside it.
 *
 * Without credentials, emailwerk runs a request only when its root selects
 * `sendTemplateMail` alone (the anonymous gate, src/auth/anonymous.ts in the
 * emailwerk repository). Any other field next to it, `__typename` included,
 * turns the answer into a 401.
 */
const SEND_TEMPLATE_MAIL =
  'mutation SendTemplateMail($args: SendTemplateMailArgsInput!) ' +
  '{ sendTemplateMail(args: $args) { id status } }';

/** What the public branch of `sendTemplateMail` accepts, and all of it. */
interface PublicSendArgs {
  templateId: string;
  envelopeOverride: { replyTo: string };
  values: Record<string, string>;
}

/**
 * Posts one send to emailwerk and says whether emailwerk queued it.
 *
 * This is a plain fetch on purpose. The `sendTemplateMail` helper in jaen
 * resolves through gqty, whose default retry policy sends a request that
 * failed in the network up to three more times, one second apart. The network can fail
 * after emailwerk has accepted the send, when only the answer is lost, and
 * then every repeat delivers the enquiry and the visitor's confirmation once
 * more. Here one press of Send is one POST. When it fails, the dialog says
 * so, keeps the form and offers the prepared mail, and trying again is the
 * visitor's decision.
 *
 * It never sends credentials. The jaen helper attaches the session token of a
 * signed-in editor, and with a token emailwerk takes its authenticated branch,
 * which refuses an editor without an emailwerk role and chains the
 * confirmation to the office inbox instead of the visitor. The form is how
 * visitors reach the office, so it always takes the public branch.
 *
 * Only an answer that carries the queued message counts as sent. A refusal,
 * which is a GraphQL error with a code, an HTTP error status, an answer that
 * is not JSON and a fetch that rejects because the connection broke or the
 * browser blocked the answer all count as not sent.
 */
const sendOnce = async (args: PublicSendArgs): Promise<boolean> => {
  try {
    const response = await fetch(EMAILWERK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify({
        query: SEND_TEMPLATE_MAIL,
        operationName: 'SendTemplateMail',
        variables: { args }
      })
    });

    if (!response.ok) return false;

    const result = await response.json();

    return !result?.errors?.length && Boolean(result?.data?.sendTemplateMail?.id);
  } catch {
    return false;
  }
};

/**
 * The words of the prepared mail, in the language the form was filled in.
 *
 * The dialog offers that mail when a send fails, see {@link enquiryMailto}.
 * The confirmation emailwerk sends the visitor takes nothing from here. Its
 * subject and texts are fixed in the "fhkit Contact Confirmation" template,
 * one set per language of the site, and the send names only the page's
 * locale.
 */
const mailtoText = (intl: ReturnType<typeof useIntl>) => ({
  heading: intl.formatMessage({
    id: 'MailConfirmHeading',
    defaultMessage: 'Kontaktanfrage'
  }),
  labelName: intl.formatMessage({
    id: 'MailConfirmLabelName',
    defaultMessage: 'Name:'
  }),
  labelEmail: intl.formatMessage({
    id: 'MailConfirmLabelEmail',
    defaultMessage: 'E-Mail:'
  }),
  labelPhone: intl.formatMessage({
    id: 'MailConfirmLabelPhone',
    defaultMessage: 'Telefonnummer:'
  }),
  labelMessage: intl.formatMessage({
    id: 'MailConfirmLabelMessage',
    defaultMessage: 'Nachricht:'
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
  text: ReturnType<typeof mailtoText>
) => {
  const name = `${data.firstName} ${data.lastName}`.trim();

  const lines = [
    `${text.labelName} ${name}`,
    `${text.labelEmail} ${data.email}`
  ];

  if (data.phone) lines.push(`${text.labelPhone} ${data.phone}`);

  lines.push('', text.labelMessage, data.message.replace(/\r?\n/g, '\r\n'));

  // RFC 6068 asks for CRLF line breaks in a mailto body, the visitor's own
  // ones in the message included.
  return (
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent(`${text.heading}: ${name}`)}` +
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
    // The "fhkit Contact" template on emailwerk, flagged isPublic, and posted
    // without credentials, so emailwerk takes its public branch. Recipients
    // come from the template's stored envelope server-side and cannot be
    // passed from here at all. `replyTo` is the only override an anonymous
    // caller is allowed, and it is also the address emailwerk delivers the
    // linked confirmation template to. Sending that confirmation from here
    // would deliver it twice.
    const sent = await sendOnce({
      templateId: CONTACT_TEMPLATE_ID,
      envelopeOverride: {
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
        // Only the page's language goes along for the confirmation mail. Its
        // subject and texts are fixed in the "fhkit Contact Confirmation"
        // template, one set per language of the site, chosen by this value
        // and German when it is missing or unknown.
        locale: intl.locale
      }
    });

    if (sent) {
      return { ok: true };
    }

    return {
      ok: false,
      mailbox: CONTACT_EMAIL,
      mailto: enquiryMailto(data, mailtoText(intl))
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
