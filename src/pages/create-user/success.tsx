import {Field, PageConfig} from '@atsnek/jaen'
import {
  Box,
  Container,
  Heading,
  Icon,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react'
import {FaCheckCircle} from '@react-icons/all-files/fa/FaCheckCircle'
import {graphql} from 'gatsby'

export interface SuccessPageProps {}

const SuccessPage: React.FC<SuccessPageProps> = () => {
  return (
    <Box id="coco" minH="100dvh" w="full">
      <Container maxW="lg" py={{base: '6', md: '12'}} px={{base: '0', sm: '8'}}>
        <Stack spacing="8">
          <Stack spacing={{base: '2', md: '3'}} textAlign="center">
            <Field.Text
              name="heading"
              defaultValue="Verification Successful!"
              as={Heading}
              size={{base: 'xs', md: 'sm'}}
            />
            <Field.Text
              name="text"
              defaultValue="Congratulations! Your account has been verified"
              as={Text}
              color="fg.muted"
            />
          </Stack>
          <Box
            py={{base: '0', sm: '8'}}
            px={{base: '4', sm: '10'}}
            bg="bg.surface"
            boxShadow={{base: 'none', sm: 'md'}}
            borderRadius={{base: 'none', sm: 'xl'}}>
            <VStack spacing="4">
              <Icon
                as={FaCheckCircle}
                boxSize={'24'}
                color={'green.500'}
                mb={4}
              />
              <VStack>
                <Field.Text
                  name="body-heading"
                  defaultValue="Success!"
                  as={Heading}
                  size="sm"
                  textAlign="center"
                />
                <Field.Text
                  name="body-text"
                  defaultValue="You can now access all the features of your account. Enjoy!"
                  mt={4}
                  textAlign="center"
                />
              </VStack>
            </VStack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default SuccessPage

export const pageConfig: PageConfig = {
  label: 'Account Verification Success',
  withoutJaenFrame: true,
  layout: {
    name: 'jaen',
    type: 'form'
  }
}

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
  }
`

export {Head} from '@atsnek/jaen'
