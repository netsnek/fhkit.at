import { Steps, useToast } from "@chakra-ui/react";
import { sendTemplateMail } from "gatsby-jaen-emailwerk";
import React, { useMemo } from "react";
import { RouteComponentProps } from "@reach/router";

import {
  ContactFormValues,
  ContactModal,
} from "../components/ContactModal/ContactModal";
import { useAuth } from "jaen";
import { useQueryRouter } from "../hooks/use-query-router";

/**
 * The emailwerk template the form posts to.
 *
 * TODO: replace with fhkit.at's own template id once it exists. This is
 * netsnek.com's "Contact" template, which means an inquiry sent from here
 * currently lands in netsnek's inbox and the confirmation carries netsnek's
 * branding. It is here so the form is exercisable end to end during
 * development; see docs/emailwerk-setup.md for what has to be created.
 */
const CONTACT_TEMPLATE_ID = 'cmsmguuxh0038rb2pgsrpzhur';

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

  const toast = useToast();

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

  const onSubmit = async (data: ContactFormValues): Promise<void> => {
    // The "Contact" template on emailwerk, flagged isPublic, so this posts
    // anonymously when there is no CMS session and emailwerk takes its public
    // branch. Recipients come from the template's stored envelope server-side
    // and cannot be passed from here at all; `replyTo` is the only override an
    // anonymous caller is allowed, and it is also the address emailwerk
    // delivers the linked confirmation template to. Sending that confirmation
    // from here would deliver it twice.
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
        invokedOnUrl: meta?.url
      }
    });

    if (!result.ok) {
      // Deutsch
      toast({
        title: "Fehler",
        description: "Es ist ein Fehler aufgetreten.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Erfolg",
        description: "Ihre Nachricht wurde erfolgreich versendet.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
    }
  };

  const fixedValues = useMemo(() => {
    if (!authentication.user) {
      return undefined;
    }

    return {
      firstName: authentication.user.profile.given_name,
      lastName: authentication.user.profile.family_name,
      email: authentication.user.profile.email,
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
