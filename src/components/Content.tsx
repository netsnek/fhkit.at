import {
  Avatar,
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
  useColorModeValue
} from '@chakra-ui/react'
import {useContactModal} from '../services/contact'
import {Field} from '@atsnek/jaen'
import Neurons from './Neurons'
import {FeaturedProducts} from './organisms/FeaturedProductsSection/FeaturedProductsSection'
import {GoogleMaps} from './GoogleMaps'

interface Props {
  children: React.ReactNode
}

const Testimonial = (props: Props) => {
  const {children} = props

  return <Box>{children}</Box>
}

const TestimonialContent = (props: Props) => {
  const {children} = props

  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      mt="5"
      p={8}
      rounded={'xl'}
      //align={'center'}
      pos={'relative'}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: useColorModeValue('white', 'gray.800'),
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
      {children}
    </Stack>
  )
}

const TestimonialHeading = (props: Props) => {
  const {children} = props

  return (
    <Heading as={'h3'} fontSize={'xl'}>
      {children}
    </Heading>
  )
}

const TestimonialText = (props: Props) => {
  const {children} = props

  return (
    <Text
      //textAlign={'center'}
      color={useColorModeValue('gray.600', 'gray.400')}
      fontSize={'sm'}>
      {children}
    </Text>
  )
}

const TestimonialAvatar = ({
  src,
  name,
  title
}: {
  src: string
  name: string
  title: string
}) => {
  return (
    <Flex align={'center'} mt={8} direction={'column'}>
      <Avatar src={src} mb={2} objectFit={'contain'} />
      <Stack spacing={-1} align={'center'}>
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
          {title}
        </Text>
      </Stack>
    </Flex>
  )
}

const ContentSection = () => {
  const contactModal = useContactModal()
  const onContactClick = () => {
    contactModal.onOpen({
      meta: {}
    })
  }

  return (
    <Box bg="#ffffff">
      <Container
        //minH={"calc(100vh - 60px)"}
        maxW="4xl"
        px={{base: 6, md: 3}}
        py={24}>
        {/* <FeaturedProducts anchor='test' featuredProducts={[{image: "https://osg.snek.at/storage/BQACAgQAAxkDAAIsW2VFGtrO0UmpkYZV0BgslLcByh8qAAJRDwACCtMwUiMJbD4kmhDjLwQ", handle: "", product: ""},]} productsPagePath=''/> */}
        <Field.Text
          mt={{base: '20 !important', md: '0'}}
          mb="8"
          as={Heading}
          fontSize={{base: '4xl', lg: '5xl'}}
          lineHeight={1}
          fontWeight="bold"
          textAlign="left"
          //color="#b57edc"
          name="ContentSectionHeading"
          defaultValue="Wilkommen! 🙌 "
        />
        <Field.Text
          //mb="16"
          fontSize="1.2rem"
          textAlign="left"
          fontWeight="400"
          color="gray.500"
          name="ContentSectionText"
          defaultValue='Es war schon immer meine Leidenschaft, eigene Unternehmen zu leiten und mit Technologie zu jonglieren. Heute möchte ich mit dir darüber sprechen – von den Anfängen bis zur aktuellen Realität und der Zukunft, die wir gerade gestalten. 🚀
          <br/><br/>
          Meine Reise in die faszinierende Welt der Informationstechnologie begann mit der Gründung von Florian Herbert Kleber IT am 21.07.2020. Getrieben von meiner Leidenschaft✨, wollte ich den Bedarf an qualitativ hochwertigen und maßgeschneiderten IT-Dienstleistungen erfüllen. Daher gründete ich dieses Unternehmen in Villach, doch schon bald werden wir unseren Firmensitz nach Wien verlegen. 📦💼
          <br/><br/>
          Mein Fokus liegt immer auf Cyber-Security 🔒, Cloud-Diensten ☁️ und Softwareentwicklung 🎨, stets darauf bedacht, die besten Lösungen für meine Kunden zu bieten. 🙌 Mein Berufszweig ermöglicht es mir, für eine Vielzahl von Branchen zu arbeiten, immer auf der Suche nach den besten IT-Lösungen für jedes einzelne Unternehmen.
          <br/><br/>
          Auf dieser wunderbaren Reise hatten wir die Chance, unglaubliche Projekte zu verwirklichen, zusammen mit einigen der besten Experten in meinem Netzwerk. 🌐 Eines meiner liebsten Projekte war die Zusammenarbeit mit einem meiner Partner zur Entwicklung eines erfolgreichen ERP-Systems namens "Jaen". 😎
          <br/><br/>
          Ich ruhe mich aber nicht auf meinen Lorbeeren aus. Mein Unternehmen ist stets bemüht, sich weiterzuentwickeln und unser Angebot zu verfeinern. Deshalb freue ich mich, dir einen kleinen Vorgeschmack auf meine kommenden Unternehmungen geben zu können... 😉 
          <br/><br/>
          Wir planen die Gründung eines neuen Unternehmens für die Entwicklung von Enterprise-Software! Es ist eine aufregende Zeit und wir sind bereit, neue Meilensteine zu setzen. 💡🎯
          <br/><br/>
          Es ist erstaunlich zu sehen, wie weit Florian Herbert Kleber IT gekommen ist und ich freue mich auf das, was noch kommen wird. Unsere Arbeit ist unsere Leidenschaft und wir geben immer unser Bestes, um der IT-Welt das Beste von uns zu geben.
          <br/><br/>
          Ich danke dir, dass du mich auf dieser spannenden Reise begleitest und wir können es kaum erwarten, dir zu zeigen, was als Nächstes kommt! 🚀
          <br/><br/>
          Behalte also unsere Updates im Auge. Bis dahin, bleib sicher und digital! 😉
          <br/><br/>
          - Florian'
        />
      </Container>
      <Container maxW={'4xl'} pt={16} as={Stack} spacing={12}>
        <Stack spacing={0}>
          <Field.Text
            mt={{base: '20 !important', md: '0'}}
            mb="8"
            as={Heading}
            fontSize={{base: '4xl', lg: '5xl'}}
            lineHeight={1}
            fontWeight="bold"
            textAlign="left"
            name="ContentSectionHeadingTeam"
            defaultValue="Partner 🤝"
          />
          <Field.Text
            fontSize="1.2rem"
            color="gray.500"
            name="ContentSectionTextTeam"
            defaultValue="Ich biete branchenübergreifende Kundenberatung und -betreuung mit Unterstützung von Experten aus meinem umfassenden Netzwerk. In Zusammenarbeit mit meinen Partnern gewährleisten wir ein breites Angebot an Dienstleistungen. Mein Ziel ist es, gemeinsam mit dir alle deine technologischen Herausforderungen zu meistern. 💪🚀"
          />
        </Stack>
        <Stack
          direction={{base: 'column', md: 'row'}}
          spacing={{base: 10, md: 4, lg: 10}}>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Software Entwicklung</TestimonialHeading>
              <TestimonialText>
                <Field.Text
                  name="ContentSectionTextTeam1"
                  defaultValue='Als JavaScript-Großmeister🎯 und Open-Source-Veteran⚡, mit starker Cyber-Security-Grundlage🔒, liegt meine Expertise in der Webentwicklung und im Aufbau hochwirksamer ERP-Systeme ⚙️. Die erfolgreiche Entwicklung eines gemeinsamen ERP-Systems namens "Jaen"✨, zusammen mit Florian Herbert Kleber IT, unterstreicht meine Fähigkeit, proaktiv und lösungsorientiert zu handeln. Als technischer Zauberer🧙‍♂️💻 bin ich stets bereit, Probleme zu bewältigen, bevor sie entstehen, und schaffe damit ein reibungsloses technologisches Erlebnis.'
                />
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                'https://osg.snek.at/storage/BQACAgQAAxkDAAIsXGVFHb-_FNhhjNXyNo6Tb4E-1ehnAAJXDwACCtMwUgil7_Q_Zld3LwQ'
              }
              name={'Nico Schett'}
              title={'schett.net'}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Elektrotechnik</TestimonialHeading>
              <TestimonialText>
                <Field.Text
                  name="ContentSectionTextTeam2"
                  defaultValue="Ich kombiniere mein Masterstudium in Elektrotechnik⚡️ und Informationstechnik📡 mit hingebungsvoller Arbeit an Technik jeder Art. Besondere Leidenschaft habe ich für das Programmieren von Cloudsystemen, Websites und der Instandhaltung von Computern. Mit ständiger Faszination betreibe ich Server und Netzwerke. Vereinfachen und effizient machen - das ist mein Credo!💪🚀"
                />
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                'https://osg.snek.at/storage/BQACAgQAAxkDAAIsW2VFGtrO0UmpkYZV0BgslLcByh8qAAJRDwACCtMwUiMJbD4kmhDjLwQ'
              }
              name={'Christoph Clementschitsch'}
              title={'neurons.at'}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Design & Marketing</TestimonialHeading>
              <TestimonialText>
                <Field.Text
                  name="ContentSectionTextTeam3"
                  defaultValue="Wir sind eine kreative 🎨 Werbeagentur in der charmanten Stadt Villach. Zusammen mit Florian Herbert Kleber IT arbeiten wir daran, moderne, stilvolle und wirkungsvolle Online-Auftritte zu gestalten."
                />
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                'https://osg.snek.at/storage/BQACAgQAAxkDAAIsXWVGJpY-_RcMtfNgb1pEQHkhgpzcAAIdEQACCtM4Undi6U7j1-BRLwQ'
              }
              name={'Kanbon'}
              title={'kanbon.at'}
            />
          </Testimonial>
        </Stack>
        <Field.Text
          mt={{base: '20 !important', md: '0'}}
          mb="8"
          as={Heading}
          fontSize={{base: '4xl', lg: '5xl'}}
          lineHeight={1}
          fontWeight="bold"
          textAlign="left"
          //color="#b57edc"
          name="MapSectionHeading"
          defaultValue="Büroräume 📦💼"
        />
        <Box
          mb="8"
          h="xl"
          w="full"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="dark">
          <GoogleMaps
            objectFit="cover"
            h="full"
            w="100%"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2658.9368830188732!2d16.390513676126197!3d48.207831646267955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d0712a8ac8f77%3A0x79ca06186618927c!2sL%C3%B6wengasse%2028%2C%201030%20Wien!5e0!3m2!1sen!2sat!4v1699083025628!5m2!1sen!2sat"
          />
        </Box>
      </Container>
      <Flex flex={1} width={'100%'} overflow={'hidden'}>
        <Neurons display={{base: 'none', sm: 'flex'}} />
        <Neurons display={{base: 'none', md: 'flex'}} />
        <Neurons display={{base: 'none', xl: 'flex'}} />
        <Neurons />
      </Flex>
    </Box>
  )
}

export default ContentSection
