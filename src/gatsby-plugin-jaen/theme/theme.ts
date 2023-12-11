import {
  extendTheme,
  ThemeConfig,
  withDefaultColorScheme,
  baseTheme
} from '@chakra-ui/react'

export const colors = {}

const theme = extendTheme(
  baseTheme,
  {
    styles: {
      global: (props) => ({
        body: {
          //bg: "#f4f8fa",
        }
      })
    },
    colors: {
      ...baseTheme.colors,
      brand: {...baseTheme.colors.blackAlpha, 500: '#000000'}
    }
  },
  withDefaultColorScheme({
    colorScheme: 'brand'
  })
)

export default theme
