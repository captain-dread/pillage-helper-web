import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", // A blue color for primary actions
    },
    secondary: {
      main: "#90caf9", // A lighter shade of blue for secondary actions
    },
    background: {
      default: "#fafafa", // Softer white background
      paper: "#ffffff", // Surface color
    },
    text: {
      primary: "#333333", // Main text color
      secondary: "#666666", // Secondary text color
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6EA6B6",
    },
    secondary: {
      main: "#6EA6B6",
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
    fontFamily: [
      "Georgia",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

export { lightTheme, darkTheme };
