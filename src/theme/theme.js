import { createTheme } from "@mui/material/styles";

// Light Theme
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#90caf9",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
});

// Dark Theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#F1CA96",
    },
    secondary: {
      main: "#F1CA96",
    },
    background: {
      default: "#212121",
      paper: "#282828",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#a5a5a5",
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
});

export { lightTheme, darkTheme };
