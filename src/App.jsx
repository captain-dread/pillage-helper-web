import "./App.css";
import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme/theme";
import BattleContainer from "./components/BattleContainer";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const currentTheme = darkMode ? darkTheme : lightTheme;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <BattleContainer toggleDarkMode={toggleDarkMode} />
    </ThemeProvider>
  );
}

export default App;
