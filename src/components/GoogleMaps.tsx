import { Alert, Box, BoxProps, Center, Heading, Link, Spinner, Text, chakra } from '@chakra-ui/react';
  import {useCookieConsentContext} from 'jaen'
  import {useEffect, useState} from 'react'
  import {useIntl} from 'react-intl'
  // import {useCookieConsent} from '@jaenjs/jaen'
  
  export interface GoogleMapsProps extends BoxProps {
    src: string
  }
  
  export const GoogleMaps = ({src, ...props}: GoogleMapsProps) => {
    const [isMounted, setIsMounted] = useState(false)
  
    const cc = useCookieConsentContext()
    const intl = useIntl()
  
    useEffect(() => {
      setIsMounted(true)
    }, [])
  
    const handleAccept = () => {
      if (!cc) throw new Error('CookieConsentContext is not initialized')
  
      cc.accept('analytics')
  
      setMapsEnabled(true)
    }
  
    const [mapsEnabled, setMapsEnabled] = useState(false)
  
    useEffect(() => {
      if (cc) {
        const analyticsEnabled = cc.allowedCategory('analytics')
  
        setMapsEnabled(analyticsEnabled)
      }
    }, [cc])
  
    if (!isMounted) {
      return (
        <Center boxSize="full" bg="gray.200">
          <Spinner />
        </Center>
      )
    }
  
    if (mapsEnabled === false) {
      return (
        <Alert.Root
          h="full"
          status="warning"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center">
          {/* The texts come from the catalog, which has carried all three
              in five languages all along. The hard-coded German here said
              "Google Maps is nicht verfügbar" on every locale. */}
          <Alert.Title mb={1} fontSize="lg">
            {intl.formatMessage({
              id: 'MapsUnavailable',
              defaultMessage: 'Google Maps ist nicht verfügbar.'
            })}
          </Alert.Title>
          <Alert.Description maxWidth="sm">
            {intl.formatMessage({
              id: 'MapsEnableCookies',
              defaultMessage:
                'Bitte aktivieren Sie Cookies, um Google Maps anzuzeigen.'
            })}{' '}
            {/* A button, because it acts rather than navigates and an anchor
                without an href is unreachable by keyboard. `link` is no
                variant in v3, so it rendered as plain text; `underline`
                shows that it can be clicked. */}
            <Link as="button" onClick={handleAccept} variant="underline">
              {intl.formatMessage({
                id: 'MapsEnableAnalytics',
                defaultMessage: 'Analyse-Cookies aktivieren'
              })}
            </Link>
          </Alert.Description>
        </Alert.Root>
      );
    }
  
    return (
      <Box {...props} bg="gray.200" overflow={"hidden"}>
        <chakra.iframe
          src={src}
          w="calc(100% + 4px)"
          h="600"
          m="-2px"
        />
      </Box>
    )
  }