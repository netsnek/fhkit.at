import { FC } from 'react'
import {
  Box,
  BoxProps,
  Image,
  LinkBox,
  LinkOverlay,
  useBreakpointValue
} from '@chakra-ui/react'
import Marquee from 'react-fast-marquee'

// Defining type for a single client
interface Client {
  href: string
  name: string
  logo: string
}

const clients: Client[] = [
  {
    href: 'https://www.agt-guntrade.at/',
    name: 'AGT Gun Trade',
    logo: '/images/clients/agt.svg'
  },
  {
    href: 'https://www.univie.ac.at/',
    name: 'Universität Wien',
    logo: '/images/clients/univie.svg'
  },
  {
    href: 'https://www.ballons-ballons.at/',
    name: 'Ballons & Ballons',
    logo: '/images/clients/ballons.svg'
  },
  {
    href: 'https://kanbon.at/',
    name: 'Kanbon',
    logo: '/images/clients/kanbon.svg'
  },
  {
    href: 'https://www.pharmaziegasse.at/',
    name: 'Pharmaziegasse',
    logo: '/images/clients/pharmaziegasse.svg'
  },
  {
    href: 'https://www.andenkenschenken.at/',
    name: 'Andenken Schenken',
    logo: '/images/clients/andenken-schenken.png'
  },
  {
    href: 'https://www.citypension.at/',
    name: 'City Pension',
    logo: '/images/clients/citypension.png'
  }
]
// Defining type for the component props
interface ClientsMarqueeProps extends BoxProps {
  // clients: Client[];
}

const ClientsMarquee: FC<ClientsMarqueeProps> = ({...props}) => {
  // Defaulting to a 16:9 aspect ratio
  // For TypeScript, setting explicit return types on hooks is not typically necessary due to its inference
  const boxSize = useBreakpointValue({base: '230px', md: '260px'})

  return (
    <Box as="section" {...props}>
      <Marquee gradient={false} speed={60}>
        <Box display="flex" gridGap="32px">
          {clients.map((client, index) => (
            <LinkBox
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={boxSize}
              height={boxSize}
              p="2"
              mx="16"
              overflow="hidden">
              <LinkOverlay href={client.href} isExternal>
                <Image
                  src={client.logo}
                  alt={client.name}
                  boxSize="full"
                  objectFit="contain"
                />
              </LinkOverlay>
            </LinkBox>
          ))}
        </Box>
      </Marquee>
    </Box>
  )
}

export default ClientsMarquee
