import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const overrides = {
  fonts: {
    heading: `'Bangers', cursive`,
    body: `'Bangers', cursive`,
  },
  components: {
    Heading: {
      baseStyle: {
        letterSpacing: "2px",
        fontWeight: 300,
      },
    },
    Text: {
      baseStyle: {
        letterSpacing: "1px",
        fontWeight: 300,
      },
    },
    Button: {
      baseStyle: {
        letterSpacing: "1px",
      },
    },
  },
};

const theme = extendTheme({
  config,
  ...overrides,
});

export default theme;
