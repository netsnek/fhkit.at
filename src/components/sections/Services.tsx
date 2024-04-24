import {
  Image,
  Box,
  Container,
  Heading,
  Text,
  GridItem,
  Grid
} from '@chakra-ui/react'
import { Field } from '@atsnek/jaen'

const Services = () => {
  return (
    <Container
      as="section"
      maxW="6xl"
      borderRadius="2xl"
      mb={{base: '0', lg: '16'}}
      position="relative"
      overflow={{base: 'hidden', lg: 'visible'}}
      px={{base: 5, lg: 0}}
      zIndex={0}>
      <Field.Text
        mt={{base: '20 !important', md: '0'}}
        mb="8"
        as={Heading}
        fontSize={{base: '4xl', lg: '5xl'}}
        lineHeight={1}
        fontWeight="bold"
        textAlign="left"
        name="ContentSectionHeadingServices"
        defaultValue="Wir verwirklichen in Wochen,<br/>
  <span style='color:var(--chakra-colors-brand-500)'>nicht Monaten.</span>"
      />
      <Grid templateColumns={{base: '1fr', lg: '1fr 1fr'}} gap={10}>
        <GridItem colSpan={1}>
          <Box
            bg="white"
            borderRadius="xl"
            p={6}
            h="full"
            w="full"
            border="1px"
            borderColor="#f9f9f9"
            boxShadow="sm">
            <Image
              src="https://kanbon.at/wp-content/uploads/2024/02/beratung.jpg"
              alt="Beratung"
              h="200px"
              w="full"
              objectFit="cover"
              borderRadius="md"
            />
            <Text mt={4} fontSize="xl" fontWeight="bold">
              Beratung
            </Text>
            <Text mt={2} fontSize="md" color="gray.500">
              Wir beraten Sie in allen Fragen rund um die Digitalisierung.
            </Text>
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Box
            bg="white"
            borderRadius="2xl"
            p={6}
            h="full"
            w="full"
            border="1px"
            borderColor="#f9f9f9"
            boxShadow="sm">
            <Image
              src="https://kanbon.at/wp-content/uploads/2021/12/Mockup_Arneitz-scaled.jpg"
              alt="Entwicklung"
              h="200px"
              w="full"
              objectFit="cover"
              borderRadius="md"
            />
            <Text mt={4} fontSize="xl" fontWeight="bold">
              Entwicklung
            </Text>
            <Text mt={2} fontSize="md" color="gray.500">
              Wir entwickeln individuelle Softwarelösungen für Ihr Unternehmen.
            </Text>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  )
}

export default Services
