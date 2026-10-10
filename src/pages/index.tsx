import { PageConfig, PageProps } from 'jaen';
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
import { Field } from 'jaen';
import { useIntl } from 'react-intl';
import { useFieldText } from '../contexts/locale';

const IndexPage: React.FC<PageProps> = () => {
  const intl = useIntl();
  // The CMS fields' defaults, in this page's language. See useFieldText.
  const fieldText = useFieldText();

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
          defaultValue={fieldText('ContentSectionHeading')}
        />
        <Field.Text
          //mb="16"
          fontSize="1.2rem"
          textAlign="left"
          fontWeight="400"
          color="gray.500"
          name="ContentSectionText"
          defaultValue={fieldText('ContentSectionText')}
        />
        <Stack gap={0}>
          <Field.Text
            mt={{ base: '20 !important', md: '0' }}
            mb="8"
            as={Heading}
            fontSize={{ base: '4xl', lg: '5xl' }}
            lineHeight={1}
            fontWeight="bold"
            textAlign="left"
            name="ContentSectionHeadingTeam"
            defaultValue={fieldText('ContentSectionHeadingTeam')}
          />
          <Field.Text
            fontSize="1.2rem"
            color="gray.500"
            name="ContentSectionTextTeam"
            defaultValue={fieldText('ContentSectionTextTeam')}
          />
        </Stack>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 10, md: 4, lg: 10 }}
        >
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>
                {intl.formatMessage({
                  id: 'PartnerSoftwareHeading',
                  defaultMessage: 'Software Entwicklung'
                })}
              </TestimonialHeading>
              <TestimonialText>
                <Field.Text
                  name="ContentSectionTextTeam1"
                  defaultValue={fieldText('ContentSectionTextTeam1')}
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
              <TestimonialHeading>
                {intl.formatMessage({
                  id: 'PartnerElectricalHeading',
                  defaultMessage: 'Elektrotechnik'
                })}
              </TestimonialHeading>
              <TestimonialText>
                <Field.Text
                  name="ContentSectionTextTeam2"
                  defaultValue={fieldText('ContentSectionTextTeam2')}
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
              <TestimonialHeading>
                {intl.formatMessage({
                  id: 'PartnerDesignHeading',
                  defaultMessage: 'Design & Marketing'
                })}
              </TestimonialHeading>
              <TestimonialText>
                <Field.Text
                  name="ContentSectionTextTeam3"
                  defaultValue={fieldText('ContentSectionTextTeam3')}
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
          defaultValue={fieldText('MapSectionHeading')}
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

export { Head } from '../components/Head';
