import { Theme } from "@emotion/react";

export const colorTheme = {
  gray: "gray",
  main: "main",
  warn: "warn",
  darkGray: "darkGray",
};

export type ColorType = keyof typeof colorTheme;

export interface Palette {
  gray: string;
  main: string;
  warn: string;
  darkGray: string;
}

const theme: Theme = {
  palette: {
    gray: "#3A3A3A",
    warn: "#F76969",
    main: "#26D9FD",
    darkGray: "#1A1A1A",
  },
};

export { theme };
