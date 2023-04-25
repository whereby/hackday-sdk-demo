import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const overrides = {
  fonts: {
    // heading: `'Raleway', sans-serif`,
    // body: `'Nunito', sans`,
  },
};

const theme = extendTheme({
  config,
  ...overrides,
});

export default theme;
