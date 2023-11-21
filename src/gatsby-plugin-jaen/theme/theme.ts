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
        50: '#fef2f3',
        100: '#fce7e8',
        200: '#f9d2d7',
        300: '#f4adb5',
        400: '#ed7f8e',
        500: '#e25169',
        600: '#cd3152',
        700: '#bb2649',
        800: '#91203e',
        900: '#7c1f3a',
        950: '#450c1b',
      },
    }
  },
  withDefaultColorScheme({
    colorScheme: 'brand'
  })
)

export default theme
