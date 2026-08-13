import { Link, Box, Flex, Container, Heading, Text, chakra } from '@chakra-ui/react';

import { StylizedImage } from '../StylizedImage';
import servicesSvg from '../../assets/images/services.svg';
import { Field } from 'jaen';


const Services = () => {
  return (
    <Box as="section">
      <Field.Text
        mt={{ base: '24', sm: '32', lg: '40' }}
        mb="8"
        as={Heading}
        fontSize={{ base: '4xl', lg: '5xl' }}
        lineHeight={1}
        fontWeight="bold"
        textAlign="left"
        name="SectionHeadingServiceDetails1"
        defaultValue="Wir unterstützen<br/>
  <span style='color:var(--chakra-colors-brand-500)'>Ihr Unternehmen</span><br/>
  im digitalen Zeitalter<span style='color:var(--chakra-colors-brand-500)'>.</span>"
      />

      <Container maxW="container.xl" mt="16">
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="end"
        >
          <Box flex="1" textAlign="center" pr={{ lg: '12' }}>
            {/* Please replace `servicesSvg` with the source of your image or adjust as needed */}
            <StylizedImage
              sx={{
                filter:
                  'hue-rotate(180deg) saturate(1.3) brightness(1.1) contrast(0.9)'
              }}
              src={servicesSvg}
              boxSize={{ base: '31rem', lg: '41rem' }}
              m="auto"
            />
          </Box>
          <Box
            mt={{ base: '16', lg: '0' }}
            flex="1"
            minW={{ lg: '33rem' }}
            pl={{ lg: '4' }}
          >
            {/* For each ListItem you can create a custom component or structure here */}
            <Box mb="6">
              <Heading as="h4" size="md">
                UX-Konzeption
              </Heading>
              <Text mt="2">
                Durch den Einsatz moderner UX-Methoden gestalten wir
                benutzerfreundliche und intuitive Oberflächen.
              </Text>
            </Box>
            <Box mb="6">
              <Heading as="h4" size="md">
                Web development
              </Heading>
              <Text mt="2">
                Wir kreieren moderne Websites und Webanwendungen, die exakt auf
                Ihre individuellen Bedürfnisse zugeschnitten sind.
              </Text>
            </Box>
            <Box mb="6">
              <Heading as="h4" size="md">
                Backend development
              </Heading>
              <Text mt="2">
                Unsere maßgeschneiderten Backend-Lösungen werden speziell auf
                Ihre Anforderungen abgestimmt und basieren auf dem Framework{' '}
                <Link href="/jaen" textDecoration="underline">
                  Pylon
                </Link>
                .
              </Text>
            </Box>
            <Box mb="6">
              <Heading as="h4" size="md">
                Content management
              </Heading>
              <Text mt="2">
                Mit{' '}
                <Link href="/jaen" textDecoration="underline">
                  Jaen
                </Link>{' '}
                als Content-Management-System ermöglichen wir es Ihnen, Ihre
                Website eigenständig zu verwalten.
              </Text>
            </Box>
          </Box>
        </Flex>
      </Container>
      <Field.Text
        mt={{ base: '24', sm: '32', lg: '40' }}
        mb="8"
        as={Heading}
        fontSize={{ base: '4xl', lg: '5xl' }}
        lineHeight={1}
        fontWeight="bold"
        textAlign="left"
        name="SectionHeadingServiceDetails2"
        defaultValue="Wir lösen<br/>
  <span style='color:var(--chakra-colors-brand-500)'>Ihr Probleme</span><br/>
  zur Not mit Quantencomputern<span style='color:var(--chakra-colors-brand-500)'>.</span>"
      />
    </Box>
  );
};

export default Services;
