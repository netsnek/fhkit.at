import {
  Container,
  Flex,
  VStack,
  Link,
  LinkBox,
  LinkOverlay,
  GridItem,
  Grid,
  AspectRatio
} from '@chakra-ui/react'
import {Field} from '@atsnek/jaen'
import ContactButton from '../ContactButton'

import {HBalloon} from '../../gatsby-plugin-jaen/components/Ballons_Ballons'
import {AGTIcon} from '../../gatsby-plugin-jaen/components/agtguntrade'
import {LibaIcon} from '../../gatsby-plugin-jaen/components/liba'
import {FHKITIcon} from '../../gatsby-plugin-jaen/components/fhkit'
import {MyP5Icon} from '../../gatsby-plugin-jaen/components/p5'
import {WGIcon} from '../../gatsby-plugin-jaen/components/wgstros'

const Contact = () => {
  // Sample list of your links and icons, assuming you will replace these with your actual data
  const links = [
    {href: 'https://facebook.com', icon: HBalloon},
    {href: 'https://facebook.com', icon: AGTIcon},
    {href: 'https://facebook.com', icon: LibaIcon},
    {href: 'https://facebook.com', icon: FHKITIcon},
    {href: 'https://facebook.com', icon: MyP5Icon},
    {href: 'https://facebook.com', icon: WGIcon}
  ]

  return (
    <Container
      as="section"
      maxW="5xl"
      borderRadius="2xl"
      borderTop="1px solid"
      borderColor={'brand.500'}
      mb={{base: '0', lg: '16'}}
      position="relative"
      //mt="-25px"
      overflow={{base: 'hidden', lg: 'visible'}}
      px={{base: 5, lg: 0}}
      bgColor="#0A0A0A"
      zIndex={0}>
      <Flex
          px={{base: '4', lg: '16'}}
          color={'white'}
          wrap={{base: 'wrap', lg: 'nowrap'}}
          alignItems={'center'}
          justifyContent={{base: 'center', lg: 'space-between'}}>
          <VStack
            alignItems={{base: 'center', lg: 'start'}}
            py={16}
            //textAlign={{base: 'center', lg: 'initial'}}
            w={{base: 'full', lg: '50%'}}>
            <Field.Text
              name="FooterTitleLine1"
              defaultValue="Erzählen Sie uns<br>
                von Ihrer Idee<span style='color:var(--chakra-colors-brand-500)'>.</span>"
              fontSize={{base: '3xl', lg: '4xl'}}
              fontWeight="500"
              w={{base: 'full', lg: 'fit-content'}}
              display={{base: 'block', lg: 'initial'}}
              //mr={{base: 0, md: 3}}
            />
            <Field.Text
              name="FooterTextNew"
              defaultValue='<b>E-Mail</b><br>
              <a href="mailto:office@netsnek.com">office@netsnek.com</a><br>
              <br>
              <b>Telefon</b><br>
              <a href="tel:+43 650 834 88 11">+43 650 834 88 11</a><br>
              <br>
              <span style="font-weight: 700;">Oder besuchen Sie uns?</span><br>
              Löwengasse 28 / Lokal 2A<br>
              1030, Wien<br>
              Österreich'
              mt={10}
              w="full"
              maxW={{base: 'full', lg: '50%'}}
              fontSize="1.1rem"
              // textAlign={{base: 'center', lg: 'initial'}}
            />
          </VStack>
          <Grid
        templateColumns="repeat(3, 1fr)"
        gap={10}
        pb={{base: '16', lg: '0'}}
        w={{base: 'full', lg: '50%'}}
        maxW={{base: '500px', lg: 'full'}}
        alignItems={'center'}>
        <GridItem
          mb={4}
          pos="relative"
          display="flex"
          colSpan={3}
          justifyContent={'center'}
          alignItems={'center'}>
          {/* <ImportantArrow pos="absolute" top="-150%" right="-10%" h="300%" /> */}
          <ContactButton
            pos="relative"
            _before={{
              zIndex: '-1',
              pointerEvents: 'none',
              top: '-150px',
              left: '-45px',
              pos: 'absolute',
              content: `""`,
              h: '500px',
              maxW: '325px',
              w: '100vw',
              bgImage: '/images/importantarrow.svg',
              bgSize: '100%,contain',
              bgRepeat: 'no-repeat'
            }}
            size={'lg'}
            mt={10}
            inverted
          />
        </GridItem>
        {links.map((link, index) => (
          <LinkBox
            key={index}
            w="auto"
            h="auto"
            color="white"
            transition="color 0.2s"
            _hover={{color: 'brand.500'}}>
            <LinkOverlay href={link.href} isExternal>
              <AspectRatio ratio={4 / 3}>
                {/* Assuming you have a way to dynamically select your icon component */}
                <link.icon w="full" h="full" />
              </AspectRatio>
            </LinkOverlay>
          </LinkBox>
        ))}
        {/* Den Wrapper um den Link mit GridItem oder einer ähnlichen Komponente und setze colSpan auf 3 */}
        <GridItem display="flex" colSpan={3} justifyContent={'flex-end'}>
          <Link
            href="/projects"
            variant="hover-theme"
            //textDecor={"underline"}
            opacity={0.7}>
            <Field.Text
              name="FooterLinkAllProjects"
              defaultValue="Lassen Sie sich inspirieren"
              fontSize="xl"
              //fontWeight="500"
            />
          </Link>
        </GridItem>
      </Grid>
          {/* <Box
              w={{base: 'full', lg: 'fit-content'}}
              textAlign={{base: 'center', lg: 'initial'}}
              pl={"16"}
              >
              <Field.Text
                name="FooterTitleLine2"
                defaultValue="Oder lassen Sie sich vun unseren Kunden inspirieren<span style='color:var(--chakra-colors-brand-500)'>.</span>"
                fontSize="2xl"
                fontWeight="500"
                w={{base: 'full', lg: 'fit-content'}}
                display={{base: 'block', lg: 'initial'}}
                
                mr={{base: 0, md: 3}}
              />
            </Box> */}
        </Flex>
    </Container>
  )
}

export default Contact
