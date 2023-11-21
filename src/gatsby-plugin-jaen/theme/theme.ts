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
      brand: {
        50: '#f9d2d7',
        100: '#f4adb5',
        200: '#ed7f8e',
        300: '#e25169',
        400: '#cd3152',
        500: '#bb2649',
        600: '#91203e',
        700: '#7c1f3a',
        800: '#450c1b',
      },
    }
  },
  withDefaultColorScheme({
    colorScheme: 'brand'
  })
)

export default theme
