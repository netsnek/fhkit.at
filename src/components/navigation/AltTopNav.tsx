import {
  Text,
  Box,
  Flex,
  HStack,
  useDisclosure,
  IconButton,
  Grid,
  Container,
  Icon,
  Spacer,
  Button,
  LinkOverlay,
  LinkBox,
  useColorModeValue,
  Tooltip,
  Heading
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import { useContactModal } from '../../services/contact';
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter';
import { FaGithub } from '@react-icons/all-files/fa/FaGithub';
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram';
import { FaFacebook } from '@react-icons/all-files/fa/FaFacebook';
import { FaPhoneAlt } from '@react-icons/all-files/fa/FaPhoneAlt';
import { FiSearch } from '@react-icons/all-files/fi/FiSearch';
import Netsnek from '../Netsnek';
import Logo from '../../gatsby-plugin-jaen/components/Logo';
import HamburgerMenuIcon, {
  THamburgerMenuIconStylerProps
} from '../AltHamburgerMenuIcon';
import SearchMenu from '../search-menu';
import { FadeIn } from '../FadeIn';

interface IAltTopNavProps {
  path: string;
  hamburgerIconProps?: THamburgerMenuIconStylerProps;
}

const AltTopNav: FC<IAltTopNavProps> = ({ path, hamburgerIconProps }) => {
  hamburgerIconProps = {
    color: 'red.500'
  };
  const contactModal = useContactModal();
  const handleOnContactClick = () => {
    console.log('contactModal', contactModal);
    contactModal.onOpen({
      meta: {}
    });
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hamburgerClass, setHamburgerClass] = useState('');

  const openDrawer = () => {
    setHamburgerClass('open');
    onOpen();
  };

  const closeDrawer = () => {
    setHamburgerClass('');
    onClose();
  };

  const toggleMobileMenu = () => {
    if (hamburgerClass === 'open') closeDrawer();
    else openDrawer();
  };

  return (
    <Box
      as={FadeIn}
      pos="relative"
      overflow="hidden"
      height={isOpen ? 'calc(100vh + 15px)' : { base: '12vh', md: '15vh' }}
      minH={isOpen ? '600px' : '100px'}
      transition="height 0.2s cubic-bezier(0.68, 0, 0.27, 1), min-height 0.2s cubic-bezier(0.68, 0, 0.27, 1)"
      borderBottomRadius={'2xl'}
    >
      <Box
        pos="relative"
        bg="#0A0A0A"
        color="white"
        transition="height 0.2s cubic-bezier(0.68, 0, 0.27, 1), min-height 0.2s cubic-bezier(0.68, 0, 0.27, 1)"
        height={isOpen ? 'max(600px, calc(100vh + 15px))' : '0'}
        minH={isOpen ? 'fit-content' : '0'}
        width="100%"
        overflow="hidden"
      >
        <Grid
          as={Container}
          maxW="8xl"
          minH="max(600px, calc(100vh + 15px))"
          templateRows={{
            base: 'auto repeat(7, 1fr)',
            md: 'auto repeat(3, 1fr)'
          }} // Set the first row height to 15vh
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          templateAreas={{
            base: `"empty" "services" "team" "portfolio" "blog" "offices" "social"`,
            md: `"empty empty"
                         "services team"
                         "portfolio blog"
                         "offices social"`
          }}
          //gap={4}
          fontSize={{ base: 'xx-large', md: 'xxx-large' }}
          h="full"
          w="full"
        >
          <Box
            gridArea="empty"
            h={{ base: '12vh', md: '15vh' }}
            minH={{ base: '100px', md: '100px' }}
          />
          <LinkBox
            gridArea="services"
            display="flex"
            pl={{ base: '8', md: '16' }}
            alignItems="center"
            borderWidth="1px"
            borderStyle="solid"
            borderRight="1px"
            borderLeft="0"
            borderBottom="0"
            borderColor={useColorModeValue('gray.900', 'gray.600')}
            transition="color 0.2s"
            _hover={{
              color: 'brand.500'
            }}
          >
            <LinkOverlay href="/docs">Unsere Services</LinkOverlay>
          </LinkBox>
          <LinkBox
            gridArea="team"
            display="flex"
            pl={{ base: '8', md: '16' }}
            alignItems="center"
            borderWidth="1px"
            borderStyle="solid"
            borderBottom="0"
            borderRight="0"
            borderLeft={{ base: '1px', md: '0px' }}
            borderColor={useColorModeValue('gray.900', 'gray.600')}
            transition="color 0.2s"
            _hover={{
              color: 'brand.500'
            }}
          >
            <LinkOverlay href="/docs">Dokumentation</LinkOverlay>
          </LinkBox>
          <LinkBox
            gridArea="portfolio"
            display="flex"
            pl={{ base: '8', md: '16' }}
            alignItems="center"
            borderWidth="1px"
            borderStyle="solid"
            borderRight="1px"
            borderLeft="0"
            borderColor={useColorModeValue('gray.900', 'gray.600')}
            transition="color 0.2s"
            _hover={{
              color: 'brand.500'
            }}
          >
            <LinkOverlay href="/docs">Unser Portfolio</LinkOverlay>
          </LinkBox>
          <LinkBox
            gridArea="blog"
            display="flex"
            pl={{ base: '8', md: '16' }}
            alignItems="center"
            borderWidth="1px"
            borderRight="0"
            borderLeft={{ base: '1px', md: '0px' }}
            borderStyle="solid"
            borderColor={useColorModeValue('gray.900', 'gray.600')}
            transition="color 0.2s"
            _hover={{
              color: 'brand.500'
            }}
          >
            <LinkOverlay href="/experiments">Blog</LinkOverlay>
          </LinkBox>
          <Box
            gridArea="offices"
            pt={{ base: '8' }}
            pl={{ base: '8', md: '16' }}
            borderWidth="1px"
            borderTop="0"
            borderBottom="0"
            borderRight={{ base: '1px', md: '0px' }}
            borderLeft="0"
            borderStyle="solid"
            borderColor={useColorModeValue('gray.900', 'gray.600')}
          >
            {/* Office information here */}
            <Text color="white" fontWeight="bold" fontSize="lg" pb="4">
              Im Herzen von Wien
            </Text>
            <Text color="white" fontSize="md">
              Hauptquartier
            </Text>
            <Text color="gray.400" fontSize="md">
              Löwengasse 28
            </Text>
            <Text color="gray.400" fontSize="md">
              1030 Vienna, Austria
            </Text>
          </Box>
          <Box
            gridArea="social"
            pt={{ base: '8' }}
            pl={{ base: '8', md: '16' }}
            borderWidth="1px"
            borderTop="0"
            borderBottom="0"
            borderRight="0"
            borderLeft="0"
            borderStyle="solid"
            borderColor={useColorModeValue('gray.900', 'gray.600')}
          >
            {/* Social media links here */}
            <Text color="white" fontWeight="bold" fontSize="lg">
              Folge uns auf
            </Text>
            <HStack spacing="8">
              <LinkBox
                mr="4"
                display="flex"
                transition="color 0.2s"
                _hover={{
                  color: 'brand.500'
                }}
              >
                <LinkOverlay href="https://facebook.com/netsnek" isExternal>
                  <Icon as={FaFacebook} boxSize="6" />
                </LinkOverlay>
              </LinkBox>
              <LinkBox
                mr="4"
                display="flex"
                transition="color 0.2s"
                _hover={{
                  color: 'brand.500'
                }}
              >
                <LinkOverlay href="https://instagram.com/netsnek" isExternal>
                  <Icon as={FaInstagram} boxSize="6" />
                </LinkOverlay>
              </LinkBox>
              <LinkBox
                mr="4"
                display="flex"
                transition="color 0.2s"
                _hover={{
                  color: 'brand.500'
                }}
              >
                <LinkOverlay href="https://twitter.com/netsnek_com" isExternal>
                  <Icon as={FaTwitter} boxSize="6" />
                </LinkOverlay>
              </LinkBox>
              <LinkBox
                mr="4"
                display="flex"
                transition="color 0.2s"
                _hover={{
                  color: 'brand.500'
                }}
              >
                <LinkOverlay href="https://github.com/netsnek" isExternal>
                  <Icon as={FaGithub} boxSize="6" />
                </LinkOverlay>
              </LinkBox>
            </HStack>
          </Box>
        </Grid>
      </Box>
      {/* The rest of your AltTopNav and navigation components */}
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
            <HStack as={LinkBox} flex="2" mr="4" w="max-content">
              <Logo minH="50px" minW="50px" maxH="60px" maxW="60px" mr="3" />
              <Text
                display={{ base: 'none', md: 'flex' }}
                as={Heading}
                whiteSpace={'nowrap'}
                size="h5030"
                fontSize="5xl"
                lineHeight={1}
                fontWeight="bold"
                //textAlign="left"
                //color="#b57edc"
              >
                Florian Herbert Kleber IT
              </Text>
            </HStack>
            <Flex alignItems="center" flex="1" justifyContent="flex-end">
              {/* <SearchMenu
                boxSizing={'border-box'}
                borderWidth={{ base: 0, lg: 2 }}
                color={{ base: 'white', lg: 'gray.400' }}
                _hover={{
                  borderColor: 'brand.600',
                  bg: { base: 'brand.600', lg: 'transparent' }
                }}
              /> */}
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
                as={LinkBox}
                zIndex={1}
                _hover={{
                  textDecoration: 'underline',
                  bg: useColorModeValue('gray.100', 'gray.700')
                }}
              >
                <Icon as={Netsnek} w={'24px'} h={'24px'} mr={2} />
                <LinkOverlay href="https://netsnek.com" isExternal>
                  Netsnek
                </LinkOverlay>
              </Flex>
              <Button
                ml={4}
                filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                borderRadius={'lg'}
                onClick={handleOnContactClick}
                fontSize="sm"
                fontWeight="semibold"
                color="white"
                display={{ base: 'none', md: 'block' }}
              >
                Jetzt anfragen
              </Button>
              <Tooltip label="Kontakt" aria-label="Kontakt">
                <IconButton
                  ml={4}
                  filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                  display={{
                    base: 'flex',
                    md: 'none'
                  }}
                  size="md"
                  aria-label="Kontakt"
                  icon={<FaPhoneAlt />}
                  onClick={handleOnContactClick}
                />
              </Tooltip>
              {/* <Button
                  ml={4}
                  filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                  borderRadius={'lg'}
                  onClick={handleOnContactClick}
                  fontSize="sm"
                  fontWeight="semibold"
                  color="white"
                  display={{base: 'none', md: 'block'}}>
                  Login
                </Button> */}
              {/* <IconButton
                ml={4}
                icon={
                  <HamburgerMenuIcon
                    handleClick={toggleMobileMenu}
                    wrapperProps={{ className: hamburgerClass }}
                    iconProps={{
                      // ...hamburgerIconProps,
                      //boxSize: '6',
                      //boxSize: '100%',
                      backgroundColor: 'white'
                    }}
                  />
                }
                filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                borderRadius={'lg'}
                //variant="ghost"
                fontWeight={'bold'}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                onClick={toggleMobileMenu}
              /> */}
            </Flex>
          </HStack>
        </Container>
      </Box>
      <Box
        pointerEvents="none"
        pos="absolute"
        top="0"
        left="0"
        transition="height 0.2s cubic-bezier(0.68, 0, 0.27, 1)"
        h={isOpen ? 'max(600px, 100vh)' : '0'} // Adjust according to your AltTopNav's initial height
        w="100%"
        overflow="hidden"
      >
        <Container maxW="8xl" pointerEvents="auto">
          <HStack
            h={{ base: '12vh', md: '15vh' }}
            minH="100px"
            alignItems={'center'}
            px={{ base: '4', md: '8' }}
            py={{ base: '2', md: '4' }}
            justifyContent="space-between"
          >
            <HStack as={LinkBox} flex="2" mr="4" w="max-content">
              <Logo minH="50px" minW="50px" maxH="60px" maxW="60px" mr="3" />
              <Text
                display={{ base: 'none', md: 'flex' }}
                as={Heading}
                whiteSpace={'nowrap'}
                size="h5030"
                fontSize="5xl"
                lineHeight={1}
                fontWeight="bold"
                //textAlign="left"
                //color="#b57edc"
              >
                Florian Herbert Kleber IT
              </Text>
            </HStack>
            <Flex alignItems="center" flex="1" justifyContent="flex-end">
              {/* <SearchMenu
                borderColor={'white'}
                boxSizing={'border-box'}
                borderWidth={{ base: 0, lg: 2 }}
                bg={{ base: 'white', lg: 'transparent' }}
                color={{ base: 'black', lg: 'gray.400' }}
                _hover={{
                  borderColor: 'brand.500',
                  bg: { base: 'brand.500', lg: 'transparent' }
                }}
              /> */}
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
                as={LinkBox}
                zIndex={1}
                _hover={{
                  textDecoration: 'underline',
                  bg: useColorModeValue('gray.100', 'gray.700')
                }}
              >
                <Icon as={Netsnek} w={'24px'} h={'24px'} mr={2} />
                <LinkOverlay href="https://netsnek.com" isExternal>
                  Netsnek
                </LinkOverlay>
              </Flex>
              <Button
                ml={4}
                _hover={{
                  bg: 'brand.500'
                }}
                borderRadius={'lg'}
                filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                //variant="ghost"
                onClick={handleOnContactClick}
                fontSize="sm"
                fontWeight="semibold"
                bg="white"
                color="black"
                display={{ base: 'none', md: 'block' }}
              >
                Jetzt anfragen
              </Button>
              <Tooltip label="Kontakt" aria-label="Kontakt">
                <IconButton
                  ml={4}
                  filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                  display={{
                    base: 'flex',
                    md: 'none'
                  }}
                  size="md"
                  aria-label="Kontakt"
                  icon={<FaPhoneAlt />}
                  onClick={handleOnContactClick}
                />
              </Tooltip>
              {/* <Button
                  ml={4}
                  _hover={{
                    bg: 'brand.500'
                  }}
                  borderRadius={'lg'}
                  filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                  //variant="ghost"
                  onClick={handleOnContactClick}
                  fontSize="sm"
                  fontWeight="semibold"
                  bg="white"
                  color="black"
                  display={{base: 'none', md: 'block'}}>
                  Login
                </Button> */}
              {/* <IconButton
                ml={4}
                _hover={{
                  bg: 'brand.500'
                }}
                icon={
                  <HamburgerMenuIcon
                    // handleClick={toggleMobileMenu}
                    wrapperProps={{ className: hamburgerClass }}
                    iconProps={{
                      // ...hamburgerIconProps,
                      //boxSize: '6',
                      //boxSize: '100%',
                      backgroundColor: 'black'
                    }}
                  />
                }
                filter="drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1))"
                borderRadius={'lg'}
                //variant="ghost"
                fontWeight={'bold'}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                onClick={toggleMobileMenu}
                bg={'white'}
                color={'black'}
              /> */}
            </Flex>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};

export default AltTopNav;
