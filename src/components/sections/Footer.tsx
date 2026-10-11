import { Box,
  Center,
  Heading,
  Container,
  Flex,
  HStack,
  Icon,
  Image,
  LinkBox,
  LinkOverlay,
  Spacer,
  Text,
  VStack,
  Separator,
} from '@chakra-ui/react';
import { useColorModeValue } from 'jaen';
import { graphql, useStaticQuery } from 'gatsby';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'gatsby-plugin-jaen';
import { Field } from 'jaen';
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter';
import { FaGithub } from '@react-icons/all-files/fa/FaGithub';
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram';
import { FaFacebook } from '@react-icons/all-files/fa/FaFacebook';
import Logo from '../../gatsby-plugin-jaen/components/Logo';
import { useFieldText, useLocalizeHref } from '../../contexts/locale';

/**
 * The year the copyright line names.
 *
 * The static HTML carries the year of the build, so the server render and the
 * browser's first render agree and hydration stays clean. After mount the
 * browser moves it on to the current year, so a page built in one year still
 * reads right in the next one without a rebuild. A year written into the text
 * itself is how the line came to say 2024 for good.
 */
const useCopyrightYear = (): number => {
  const data = useStaticQuery<{ site: { buildTime: string } }>(graphql`
    query FooterCopyrightYear {
      site {
        buildTime(formatString: "YYYY")
      }
    }
  `);

  const [year, setYear] = useState(() => Number(data.site.buildTime));

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return year;
};

/**
 * Footer component.
 */
const Footer: FC = () => {
  const localizeHref = useLocalizeHref();
  const fieldText = useFieldText();
  const year = useCopyrightYear();
  const intl = useIntl();

  /**
   * `label` names the CMS field (FooterLinkTitle<label>, FooterLink<label>)
   * and is its default where the text is a name. `text` is the default where
   * the text is a word, from the catalog in the page's language.
   */
  const links: Array<
    Array<{ label: string; text?: string; href?: string; isTitle?: boolean }>
  > = [
    [
      {
        label: 'Links',
        text: fieldText('FooterLinkTitleLinks'),
        isTitle: true
      },
      {
        label: 'GitHub',
        href: 'https://github.com/kleberbaum'
      },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/kleberbaum/'
      },
      {
        label: 'Telegram',
        href: 'https://t.me/kleberbaum'
      },
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/kleberbaum/'
      },
      {
        // The page is /imprint/, in each locale under its prefix. The old
        // /impressum target does not exist, and with no 404 page the link
        // quietly showed the home page instead of the legal notice.
        label: 'Impressum',
        text: fieldText('FooterLinkImpressum'),
        href: localizeHref('/imprint/')
      }
    ],
    [
      {
        label: 'Partner',
        text: fieldText('FooterLinkTitlePartner'),
        isTitle: true
      },
      {
        label: 'Nico Schett',
        href: 'https://schett.net'
      },
      {
        label: 'Christoph Clementschitsch',
        href: 'https://neurons.at'
      },
      {
        label: 'Kanbon',
        href: 'https://kanbon.at'
      }
    ],
    [
      {
        label: 'Gestaltet von',
        text: fieldText('FooterLinkTitleDesignedBy'),
        isTitle: true
      },
      {
        label: 'Florian H. Kleber',
        href: 'https://github.com/kleberbaum'
      }
    ]
  ]

  const linkElmnts: ReactNode[] = [];

  links.forEach((linkGroup, i) => {
    linkElmnts.push(
      <VStack gap={3} alignItems="start" wrap="wrap" key={i}>
        {linkGroup.map((link, i) => {
          if (link.isTitle) {
            return (
              <Field.Text
                key={i}
                name={'FooterLinkTitle' + link.label}
                defaultValue={link.text ?? link.label}
                fontWeight="500"
              />
            );
          }
          return (
            // White on hover. The variant's hover colour is the near-black
            // brand, which made a hovered link vanish into the black footer.
            <Link
              key={i}
              href={link.href}
              variant="hover-theme"
              opacity={0.7}
              _hover={{ color: 'white', opacity: 1 }}
            >
              <Field.Text
                name={'FooterLink' + link.label}
                defaultValue={link.text ?? link.label}
              />
            </Link>
          );
        })}
      </VStack>
    );
  });

  return (
    <>
      <Box
        borderTopRadius="2xl"
        borderTop="1px solid"
        borderColor={useColorModeValue('brand.500', 'brand.200')}
        pb={20}
        position="relative"
        //mt="-25px"
        px={{ base: 5, lg: 0 }}
        overflowX="hidden"
        bgColor="#0A0A0A"
        zIndex={0}
      >
        <Container maxW="7xl" h="100%">
          <Box mt="20vh" color="white">
            <Flex
              maxW={{ base: 'full', lg: '75%' }}
              wrap={{ base: 'wrap', lg: 'nowrap' }}
            >
              <Box
                w={{ base: 'full', lg: 'fit-content' }}
                textAlign={{ base: 'center', lg: 'initial' }}
              >
                <Field.Text
                  name="FooterTitleLine1"
                  defaultValue={fieldText('FooterTitleLine1')}
                  fontSize="4xl"
                  fontWeight="500"
                  w={{ base: 'full', lg: 'fit-content' }}
                  display={{ base: 'block', lg: 'initial' }}
                  mr={{ base: 0, md: 3 }}
                />
              </Box>
            </Flex>
            {/* The business address as the legal notice gives it: Florian
                Herbert Kleber IT is now Netsnek e.U., which sits in Vienna. */}
            <Field.Text
              name="FooterTextNew"
              defaultValue={fieldText('FooterTextNew')}
              mt={10}
              maxW={{ base: 'full', lg: '50%' }}
              fontSize="1.1rem"
              textAlign={{ base: 'center', lg: 'initial' }}
            />
          </Box>
          <Flex mt={20} color="white" wrap={{ base: 'wrap', sm: 'nowrap' }}>
            <Box>
              <Flex alignItems={'center'}>
                <Logo w="100px" h="200px" mr={-4} />
                <Field.Text
                  name="FooterLogoText"
                  defaultValue="leber"
                  //display={{ base: "none", md: "flex"}}
                  as={Heading}
                  whiteSpace={'nowrap'}
                  fontSize="5xl"
                  lineHeight={1}
                  fontWeight="bold"
                />
              </Flex>
            </Box>
            <Spacer minW={{ base: '5rem', lg: '25%' }} />
            <HStack
              alignItems="start"
              gap={{ base: 5, sm: 20 }}
              wrap={{ base: 'wrap', md: 'nowrap' }}
              mt={{ base: 10, md: 0 }}
            >
              {linkElmnts}
            </HStack>
          </Flex>
          {/* <Stack
            mt={20}
            as={LinkBox}
            direction={'row'}
            spacing="0"
            mx="-12px"
            flexWrap={'wrap'}>
            <IconButton
              as={LinkOverlay}
              size="lg"
              variant={'ghost'}
              color="#ffffff"
              icon={<Netsnek w={'25px'} h={'25px'} />}
              aria-label="Netsnek"
              href="https://netsnek.com/schett"
              isExternal
            />
            <IconButton
              as={LinkOverlay}
              size="lg"
              variant={'ghost'}
              color="#ffffff"
              icon={<FaGithub />}
              aria-label="Github"
              href="https://github.com/schettn/"
              isExternal
            />
            <IconButton
              as={LinkOverlay}
              size="lg"
              variant={'ghost'}
              color="#ffffff"
              icon={<FaInstagram />}
              aria-label="Instagram"
              href="https://www.instagram.com/barbara.mauz/"
              isExternal
            />
            <IconButton
              as={LinkOverlay}
              size="lg"
              variant={'ghost'}
              color="#ffffff"
              icon={<FaTelegram />}
              aria-label="Telegram"
              href="https://t.me/schettn"
              isExternal
            />
          </Stack> */}
          <HStack
            //justifyContent={"flex-end"}
            color={'white'}
            mt={20}
            gap="4"
            flexWrap={'wrap'}
            asChild
          ><LinkBox>
              <LinkBox
                mr="4"
                display="flex"
                transition="color 0.2s"
                _hover={{
                  color: 'gray.400'
                }}
              >
                <LinkOverlay
                  href="https://facebook.com/netsnek"
                  target='_blank'
                  rel='noopener noreferrer'>
                  <Icon boxSize="5" asChild><FaFacebook /></Icon>
                </LinkOverlay>
              </LinkBox>
              <LinkBox
                mr="4"
                display="flex"
                transition="color 0.2s"
                _hover={{
                  color: 'gray.400'
                }}
              >
                <LinkOverlay
                  href="https://instagram.com/netsnek"
                  target='_blank'
                  rel='noopener noreferrer'>
                  <Icon boxSize="5" asChild><FaInstagram /></Icon>
                </LinkOverlay>
              </LinkBox>
              <LinkBox
                mr="4"
                display="flex"
                transition="color 0.2s"
                _hover={{
                  color: 'gray.400'
                }}
              >
                <LinkOverlay
                  href="https://twitter.com/netsnek_com"
                  target='_blank'
                  rel='noopener noreferrer'>
                  <Icon boxSize="5" asChild><FaTwitter /></Icon>
                </LinkOverlay>
              </LinkBox>
              <LinkBox
                mr="4"
                display="flex"
                transition="color 0.2s"
                _hover={{
                  color: 'gray.400'
                }}
              >
                <LinkOverlay
                  href="https://github.com/netsnek"
                  target='_blank'
                  rel='noopener noreferrer'>
                  <Icon boxSize="5" asChild><FaGithub /></Icon>
                </LinkOverlay>
              </LinkBox>
            </LinkBox></HStack>
          <Separator mt={8} opacity={0.2} />
          {/* A message rather than the CMS field it used to be: a value
              stored in the CMS would freeze the year again. The credit names
              the legal entity, Netsnek e.U., the way nadine-hauswirth.com's
              footer does, instead of the three businesses the template fork
              carried over, in the language of the page. */}
          <Text
            mt={5}
            color="white"
            opacity={0.2}
            _hover={{
              opacity: 1
            }}
            cursor="default"
            transition="opacity 0.2s ease-in-out"
          >
            {intl.formatMessage(
              {
                id: 'FooterCopyright',
                defaultMessage: 'Copyright © {year} Netsnek e.U. Alle Rechte vorbehalten.'
              },
              { year }
            )}
          </Text>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
