import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const ThemeContext = createContext(null);

const THEME_KEY = "addis_cafe_theme";

/**
 * Separate ThemeProvider component managing the UI visual theme.
 * Kept separate from AuthProvider — no longer bundled into one value.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
      document.documentElement.setAttribute("data-theme", theme);
    } catch {
      // Storage write error ignored
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
