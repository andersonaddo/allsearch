import { extendTheme, type ThemeConfig } from "@chakra-ui/react"
import { mode } from "@chakra-ui/theme-tools";


const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: "dark"
}

//Since we're also using <DarkTheme /> on MainSearch.tsx, we have to address
//https://github.com/chakra-ui/chakra-ui/discussions/5273
//https://chakra-ui.com/docs/styled-system/global-styles
const components = {
  Heading: {
    baseStyle: (props: any) => ({
      color: mode('gray.800', 'whiteAlpha.900')(props),
    })
  },

  Text: {
    baseStyle: (props: any) => ({
      color: mode('gray.800', 'whiteAlpha.900')(props),
    })
  },

 //https://github.com/chakra-ui/chakra-ui/discussions/3110#discussioncomment-1285694
  Input: {
    variants: {
      outline: (props: any) => ({
        field: {
          color: mode('gray.800', 'whiteAlpha.900')(props),
          _placeholder: {
            color: mode("gray.400", "whiteAlpha.400")(props),
          },
        },
      }),
    },
  },
}

const theme = extendTheme({ config, components })
export default theme;