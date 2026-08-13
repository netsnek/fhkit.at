import { PageConfig, PageProps } from '@atsnek/jaen';
import { Global } from '@emotion/react';

import { graphql } from 'gatsby';
import { Flex, Heading, Stack } from '@chakra-ui/react';
import AboutUs from '../components/sections/AboutUs';
import Features from '../components/sections/Features';
import Hero from '../components/sections/Hero';
import ClientsMarquee from '../components/sections/ClientsMarquee';
import { Container } from '@chakra-ui/react';
import Services from '../components/sections/Services';
import ServicesDetails from '../components/sections/ServiceDetails';
import Associates from '../components/sections/Associates';
import { GoogleMaps } from '../components/GoogleMaps';
import Contact from '../components/sections/Contact';
import Neurons from '../components/Neurons';
import {
  Testimonial,
  TestimonialAvatar,
  TestimonialContent,
  TestimonialHeading,
  TestimonialText
} from '../components/Testimonials';
import { Field } from '@atsnek/jaen';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <>
      {/* <Global
        styles={{
          body: {
            backgroundColor: '#0D0E11'
          }
        }}
      /> */}

      <Hero />
      <ClientsMarquee w="full" />
      <Container maxW="5xl" mb="20">
        {/* <Services /> */}
        {/* <Associates /> */}
        {/* <Portfolio /> */}
        {/* <NewsSlider showNewsTitle={true} /> */}
        {/* <ServicesDetails /> */}
        <Field.Text
          mt={{ base: '20 !important', md: '0' }}
          mb="8"
          as={Heading}
          fontSize={{ base: '4xl', lg: '5xl' }}
          lineHeight={1}
          fontWeight="bold"
          textAlign="left"
          //color="#b57edc"
          name="ContentSectionHeading"
          defaultValue="Willkommen! 🙌"
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
        <Stack spacing={0}>
          <Field.Text
            mt={{ base: '20 !important', md: '0' }}
            mb="8"
            as={Heading}
            fontSize={{ base: '4xl', lg: '5xl' }}
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
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 10, md: 4, lg: 10 }}
        >
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
                  defaultValue="Ich kombiniere mein Masterstudium in Elektrotechnik⚡️ und Informationstechnik📡 mit hingebungsvoller Arbeit an Technik jeder Art. Besondere Leidenschaft habe ich für das Programmieren von Cloudsystemen, Websites und der Instandhaltung von Computern. Mit ständiger Faszination betreibe ich Server und Netzwerke. Vereinfachen und effizient machen - das ist mein Credo! 💪🚀"
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
          mt={{ base: '20 !important', md: '0' }}
          mb="8"
          as={Heading}
          fontSize={{ base: '4xl', lg: '5xl' }}
          lineHeight={1}
          fontWeight="bold"
          textAlign="left"
          //color="#b57edc"
          name="MapSectionHeading"
          defaultValue="Büroräume 📦💼"
        />
        <GoogleMaps
          objectFit="cover"
          h="full"
          w="100%"
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d995.97587950944!2d16.392940417133016!3d48.20781426146578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDjCsDEyJzI3LjUiTiAxNsKwMjMnMzUuOCJF!5e0!3m2!1sen!2sat!4v1711776420986!5m2!1sen!2sat"
        />
      </Container>
      <Flex flex={1} width={'100%'} overflow={'hidden'}>
        <Neurons display={{ base: 'none', sm: 'flex' }} />
        <Neurons display={{ base: 'none', md: 'flex' }} />
        <Neurons display={{ base: 'none', xl: 'flex' }} />
        <Neurons />
      </Flex>
    </>
  );
};

export default IndexPage;

export const pageConfig: PageConfig = {
  label: 'Home Page',
  icon: 'FaHome',
  childTemplates: ['BlogPage']
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

export { Head } from '@atsnek/jaen';
