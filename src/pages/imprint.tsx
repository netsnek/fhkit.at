import { Field, PageConfig, PageProps } from 'jaen';

import { Box, Container, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { graphql } from 'gatsby';
import * as React from 'react';
import { useIntl } from 'react-intl';

import useNavOffset from '../hooks/use-nav-offset';

/**
 * Who stands behind fhkit.at, as the legal notice states it.
 *
 * Florian Herbert Kleber IT is an unregistered trade of Florian Herbert Kleber
 * (the owner, 2026-10-11: "unprotokolliertes Gewerbe ergo keine Firmennummer
 * und keine UID"), so the notice names the trade and its owner and carries no
 * register number, no register court and no VAT id. Address and phone are
 * those of the current letterhead. The mailbox is the site's own,
 * office@fhkit.at, the address the footer and the contact confirmation give
 * as well.
 *
 * Nothing here is filled in from elsewhere: a value that is not documented is
 * left out rather than guessed.
 */
const IMPRINT = {
  company: 'Florian Herbert Kleber IT',
  owner: 'Florian Herbert Kleber',
  street: 'Löwengasse 14 / Lokal 2',
  city: '1030 Wien',
  country: 'Österreich',
  phone: '+43 650 824 88 11',
  phoneHref: 'tel:+436508248811',
  email: 'office@fhkit.at',
  web: 'fhkit.at',
  webHref: 'https://fhkit.at'
} as const;

/**
 * The legal notice of fhkit.at.
 *
 * It is written here and not in the CMS because the page used to be a single
 * CMS editor field that nobody ever filled, so the notice went out empty in
 * every language. A legal notice must not depend on an editor remembering it.
 * The field is still rendered below the notice, so the page can be extended
 * from the CMS, but nothing in the notice itself can be removed from there.
 *
 * The notice is German in every locale. It is an Austrian notice, the facts in
 * it do not change with the language, and translating the disclaimer would
 * put wording on the page that nobody approved. Only the page heading follows
 * the locale, from the same catalog entry the page title uses.
 *
 * The disclaimer and the privacy paragraph are netsnek.com's, word for word.
 * netsnek.com also has a Google Analytics paragraph, which is left out here
 * because fhkit.at does not load Google Analytics.
 */
const ImprintPage: React.FC<PageProps> = () => {
  const intl = useIntl();
  // The top navigation is fixed, so the notice starts below it, the same way
  // the docs layout offsets its content.
  const offset = useNavOffset();

  // A plain Box, not `as="main"`: the site layout already wraps every page in
  // its own main element.
  return (
    <Box>
      <Container maxW="4xl" mt={offset} py={{ base: 6, md: 10 }}>
        <Stack gap={8}>
          <Heading as="h1" fontSize={{ base: '3xl', md: '4xl' }}>
            {intl.formatMessage({
              id: 'PageTitleImprint',
              defaultMessage: 'Impressum'
            })}
          </Heading>

          <Box lang="de">
            <Text fontWeight="bold">{IMPRINT.company}</Text>
            <Text>Inhaber {IMPRINT.owner}</Text>
            <Text mt={4}>{IMPRINT.street}</Text>
            <Text>{IMPRINT.city}</Text>
            <Text>{IMPRINT.country}</Text>
          </Box>

          <Box lang="de">
            <Text>
              Tel.:{' '}
              <Link href={IMPRINT.phoneHref} textDecoration="underline">
                {IMPRINT.phone}
              </Link>
            </Text>
            <Text>
              E-Mail:{' '}
              <Link href={`mailto:${IMPRINT.email}`} textDecoration="underline">
                {IMPRINT.email}
              </Link>
            </Text>
            <Text>
              Web:{' '}
              <Link href={IMPRINT.webHref} textDecoration="underline">
                {IMPRINT.web}
              </Link>
            </Text>
          </Box>

          <Text lang="de">
            Sämtliche Texte auf der Website wurden sorgfältig geprüft. Dessen
            ungeachtet kann keine Garantie für Richtigkeit, Vollständigkeit und
            Aktualität der Angaben übernommen werden. Die Inhalte dieser Website
            dürfen weder ganz noch teilweise ohne vorherige Genehmigung des
            Urhebers zu kommerziellen Zwecken vervielfältigt und/oder in
            Informationssystemen, die zur Datenweitergabe genutzt werden,
            gespeichert werden. Schadensersatzansprüche wegen direkter oder
            indirekter Schäden, die aus der Benutzung der WWW-Dokumente
            entstehen, können nicht gegen den WWW-Verantwortlichen oder den
            Autor geltend gemacht werden. Sofern in dem Dokument durch
            Hyperlinks auf kommerzielle Websites verwiesen wird, stellt dies
            keine Empfehlung dar. Diese Links sollen nur eine (unvollständige)
            Auswahl von Möglichkeiten aufzeigen. Ein Anspruch von nicht
            berücksichtigten Websites auf Aufnahme in das Dokument besteht
            deshalb nicht. Für Informationen, die über externe Querverweise
            (Hyperlinks) erreicht werden, wird keine Gewähr übernommen.
          </Text>

          <Box lang="de">
            <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} mb={3}>
              Datenschutz
            </Heading>
            <Text>
              Wir verpflichten uns, die Privatsphäre aller Personen zu schützen,
              die unsere Site nutzen, und die persönlichen Daten, die uns von
              Kunden, Partnern und Interessenten überlassen werden, vertraulich
              zu behandeln. Grundsätzlich können Sie unsere Website jederzeit
              besuchen und durchblättern, ohne persönliche Informationen
              anzugeben. Persönliche Daten, die Sie uns über Registrierung auf
              unserer Site mitteilen, werden weder verkauft noch Dritten
              überlassen, sondern sind ausschließlich zur unternehmensinternen
              Verwendung bestimmt.
            </Text>
          </Box>
        </Stack>
      </Container>

      <Field.Editor name="imprint" />
    </Box>
  );
};

export default ImprintPage;

export const pageConfig: PageConfig = {
  label: 'Imprint page',
  icon: 'FaPassport'
};

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
    allJaenPage {
      nodes {
        ...JaenPageData
        children {
          ...JaenPageData
        }
      }
    }
  }
`;

export { Head } from '../components/Head';
