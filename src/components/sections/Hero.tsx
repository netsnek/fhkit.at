import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  useColorModeValue,
  Image,
  Icon,
  VisuallyHidden,
  IconButton
} from '@chakra-ui/react'
import {useContactModal} from '../../services/contact'
import {Field} from '@atsnek/jaen'
import {FaGithub} from '@react-icons/all-files/fa/FaGithub'
import {FaLinkedin} from '@react-icons/all-files/fa/FaLinkedin'
import {FaTelegram} from '@react-icons/all-files/fa/FaTelegram'
import {FaInstagram} from '@react-icons/all-files/fa/FaInstagram'
import {FaTwitter} from '@react-icons/all-files/fa/FaTwitter'
import Netsnek from '../Netsnek'

const HeroSection = () => {
  const contactModal = useContactModal()
  const onContactClick = () => {
    contactModal.onOpen({
      meta: {}
    })
  }

  return (
    <Container maxW="6xl" px={{base: 6, md: 3}} py={16} overflow={'hidden'}>
      <Stack
        direction={{base: 'column-reverse', lg: 'row'}}
        justifyContent="center">
        <Stack
          direction="column"
          spacing={6}
          justifyContent="center"
          maxW="480px">
          <HStack
            as={LinkBox}
            p={1}
            rounded="full"
            fontSize="sm"
            w="max-content"
            bg={useColorModeValue('gray.300', 'gray.700')}
            onClick={onContactClick}
            _hover={{
              textDecoration: 'underline',
              bg: useColorModeValue('gray.100', 'gray.700')
            }}>
            <Box
              py={1}
              px={2}
              lineHeight={1}
              rounded="full"
              color="white"
              bgColor="brand.500">
              Für dich
            </Box>
            <HStack spacing={1} alignItems="center" justifyContent="center">
              <Text as={LinkOverlay} lineHeight={1} mr={2}>
                Kostenlose Erstberatung
              </Text>
              {/* <Icon as={GoChevronRight} w={4} h={4} /> */}
            </HStack>
          </HStack>
          <Field.Text
            as={Heading}
            fontSize={{base: '4xl', lg: '5xl'}}
            lineHeight={1}
            fontWeight="bold"
            textAlign="left"
            color="#000000"
            name="HeroSectionHeading"
            defaultValue="Lass dich von <br/>
            mir beraten"
          />
          <Field.Text
            fontSize="1.2rem"
            textAlign="left"
            lineHeight="1.375"
            fontWeight="400"
            color="gray.500"
            name="HeroSectionText"
            defaultValue="Entdecke mit mir die Welt der IT-Dienstleistungen. 💻🚀 Als professioneller IT-Berater helfe ich dir dabei, deine technischen Herausforderungen zu meistern. 🎯 Meine Spezialgebiete sind Security und Cloudcomputing. ⛅🔒 <br/>
            <br/>
            Auf der Suche nach einer Optimierung deines Systems?<br/>
            <br/>
            Lass dich von mir beraten! 🤝 Erfahrung, Leidenschaft und technisches Know-how aus Österreich. Und ja, ich finde immer eine Lösung (aber ich empfehle, das Problem nicht selbst zu lösen 😉)."
          />
          <HStack
            spacing={{base: 0, sm: 2}}
            mb={{base: '3rem !important', sm: 0}}
            flexWrap="wrap">
            <Button
              w={{base: '100%', sm: 'auto'}}
              h={12}
              px={6}
              color="white"
              size="lg"
              rounded="md"
              mb={{base: 2, sm: 0}}
              zIndex={1}
              lineHeight={1}
              onClick={onContactClick}>
              Kontaktiere mich
              {/* <Icon as={MdBolt} h={4} w={4} ml={1} /> */}
            </Button>
            <Flex
              justifyContent="center"
              alignItems={'center'}
              bg={useColorModeValue('white', 'gray.800')}
              w={{base: '100%', sm: 'auto'}}
              border="1px solid"
              borderColor="gray.300"
              p={3}
              lineHeight={1.18}
              rounded="md"
              boxShadow="md"
              as={LinkBox}
              zIndex={1}
              _hover={{
                textDecoration: 'underline',
                bg: useColorModeValue('gray.100', 'gray.700')
              }}>
              <Icon as={FaGithub} w={4} h={4} mr={2} />
              <LinkOverlay href="https://github.com/kleberbaum" isExternal>
                GitHub
              </LinkOverlay>
            </Flex>
          </HStack>
        </Stack>
        <Box ml={{base: 0, md: 5}} pos="relative" flex="1">
          <DottedBox />
          <Box overflow={'hidden'} m={'10%'}>
            {/* <video autoPlay muted>
              <source src="/N0jxFNt.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video> */}
            {/* <Field.Image
              name="HeroImage"
              alt="Hero Image"
              defaultValue="/images/florian_kleber.jpg"
              h="full"
              w="full"
            /> */}
            <Image
              borderRadius={'xl'}
              src="/images/florian_kleber.jpg"
              alt="Hero Image"
              h="full"
              w="full"
            />
            <Stack
              as={LinkBox}
              direction={'row'}
              spacing="0"
              //mx="-12px"
              flexWrap={'wrap'}>
              <IconButton
                as={LinkOverlay}
                size="lg"
                variant={'ghost'}
                color="brand.500"
                icon={<Netsnek w={'25px'} h={'25px'} />}
                aria-label="Netsnek"
                href="https://netsnek.com/kleberbaum"
                isExternal
              />
              <IconButton
                as={LinkOverlay}
                size="lg"
                variant={'ghost'}
                color="brand.500"
                icon={<FaGithub />}
                aria-label="Github"
                href="https://github.com/kleberbaum/"
                isExternal
              />
              <IconButton
                as={LinkOverlay}
                size="lg"
                variant={'ghost'}
                color="brand.500"
                icon={<FaLinkedin />}
                aria-label="Linkedin"
                href="https://www.linkedin.com/in/kleberbaum/"
                isExternal
              />
              <IconButton
                as={LinkOverlay}
                size="lg"
                variant={'ghost'}
                color="brand.500"
                icon={<FaInstagram />}
                aria-label="Instagram"
                href="https://www.instagram.com/kleberbaum/"
                isExternal
              />
              <IconButton
                as={LinkOverlay}
                size="lg"
                variant={'ghost'}
                color="brand.500"
                icon={<FaTelegram />}
                aria-label="Telegram"
                href="https://t.me/kleberbaum"
                isExternal
              />
              {/*<IconButton
            as={LinkOverlay}
            size="lg"
            variant={'ghost'}
            color="#ffffff"
            icon={<FaTwitter />}
            aria-label="Twitter"
            href="https://twitter.com/kleberbaum"
            isExternal
          />*/}
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Container>
  )
}

function DottedBox() {
  return (
    <Box
      position="absolute"
      left="-45px"
      top="-30px"
      height="full"
      maxW="700px"
      zIndex={-1}>
      <svg
        color={useColorModeValue('rgba(55,65,81, 0.1)', 'rgba(55,65,81, 0.7)')}
        width="350"
        height="420"
        fill="none">
        <defs>
          <pattern
            id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
          </pattern>
        </defs>
        <rect
          width="404"
          height="404"
          fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)"></rect>
      </svg>
    </Box>
  )
}

export default HeroSection
