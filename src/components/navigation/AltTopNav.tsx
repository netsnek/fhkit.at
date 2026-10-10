import { Text,
  Box,
  Flex,
  HStack,
  IconButton,
  Container,
  Icon,
  Button,
  LinkOverlay,
  LinkBox,
  Heading,
} from '@chakra-ui/react';
import { Tooltip } from '../Tooltip';
import { useIntl } from 'react-intl';
import LanguageSwitcher from '../LanguageSwitcher';
import { useColorModeValue } from 'jaen';
import { FC } from 'react';
import { useContactModal } from '../../services/contact';
import { FaPhoneAlt } from '@react-icons/all-files/fa/FaPhoneAlt';
import Netsnek from '../Netsnek';
import Logo from '../../gatsby-plugin-jaen/components/Logo';
import { FadeIn } from '../FadeIn';

interface IAltTopNavProps {
  path: string;
}

/**
 * The home page's top bar: logo and name, the Netsnek link, the contact
 * button and the language switcher.
 *
 * The bar used to carry a full-screen menu from the template, opened by a
 * hamburger button that had long been commented out, so nothing could open it.
 * It still rendered, folded to zero height: a grid of links to /docs and
 * /experiments, an office block with the old address Löwengasse 28 and a row
 * of social links, plus a second copy of this bar for the open state. Both
 * stayed in the page source and in the keyboard order, so a keyboard user
 * tabbed through the bar's four controls twice, the second time invisibly.
 * What is left is exactly what was visible.
 */
const AltTopNav: FC<IAltTopNavProps> = () => {
  const contactModal = useContactModal();
  const handleOnContactClick = () => {
    contactModal.onOpen({
      meta: {}
    });
  };
  const intl = useIntl();

  return (
    <Box
      pos="relative"
      overflow="hidden"
      height={{ base: '12vh', md: '15vh' }}
      minH="100px"
      borderBottomRadius={'2xl'}
      asChild
    ><FadeIn>
        <Box pos="absolute" top="0" left="0" w="100%">
          <Container maxW="8xl" pointerEvents="auto">
            <HStack
              h={{ base: '12vh', md: '15vh' }}
              minH="100px"
              alignItems={'center'}
              px={{ base: '4', md: '8' }}
              py={{ base: '2', md: '4' }}
              justifyContent="space-between"
            >
              <HStack flex="2" mr="4" w="max-content" asChild><LinkBox>
                  <Logo minH="50px" minW="50px" maxH="60px" maxW="60px" mr="3" />
                  <Text
                    display={{ base: 'none', md: 'flex' }}
                    whiteSpace={'nowrap'}
                    size="h5030"
                    fontSize="5xl"
                    lineHeight={1}
                    //textAlign="left"
                    //color="#b57edc"
                    fontWeight="bold"
                    asChild
                  ><Heading>Florian Herbert Kleber IT
                                  </Heading></Text>
                </LinkBox></HStack>
              <Flex alignItems="center" flex="1" justifyContent="flex-end">
                <Flex
                  justifyContent="center"
                  alignItems={'center'}
                  bg={useColorModeValue('white', 'gray.800')}
                  w={{ base: '100%', sm: 'auto' }}
                  border="1px solid"
                  borderColor="gray.300"
                  h={10}
                  px={4}
                  fontWeight={'semibold'}
                  lineHeight={1.18}
                  rounded="md"
                  boxShadow="md"
                  zIndex={1}
                  _hover={{
                    textDecoration: 'underline',
                    bg: useColorModeValue('gray.100', 'gray.700')
                  }}
                  asChild
                ><LinkBox>
                    <Icon w={'24px'} h={'24px'} mr={2} asChild><Netsnek /></Icon>
                    <LinkOverlay href="https://netsnek.com" target='_blank' rel='noopener noreferrer'>
                      Netsnek
                    </LinkOverlay>
                  </LinkBox></Flex>
                <Button
                  ml={4}
                  filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                  borderRadius={'lg'}
                  onClick={handleOnContactClick}
                  fontSize="sm"
                  fontWeight="semibold"
                  display={{ base: 'none', md: 'block' }}
                >
                  {intl.formatMessage({id: 'NavContactCta', defaultMessage: 'Jetzt anfragen'})}
                </Button>
                {/* `fg` follows the colour mode. White made the chevron
                    invisible on the white bar of light mode. */}
                <LanguageSwitcher
                  ml={4}
                  size="sm"
                  variant="ghost-hover"
                  color="fg"
                />
                <Tooltip content={intl.formatMessage({id: 'NavContact', defaultMessage: 'Kontakt'})}>
                  <IconButton
                    ml={4}
                    filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                    display={{
                      base: 'flex',
                      md: 'none'
                    }}
                    size="md"
                    aria-label={intl.formatMessage({id: 'NavContact', defaultMessage: 'Kontakt'})}
                    onClick={handleOnContactClick}><FaPhoneAlt /></IconButton>
                </Tooltip>
              </Flex>
            </HStack>
          </Container>
        </Box>
      </FadeIn></Box>
  );
};

export default AltTopNav;
