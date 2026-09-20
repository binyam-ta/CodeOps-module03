import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

/**
 * Guarded hook for accessing ThemeContext.
 * Throws an actionable error if called outside a ThemeProvider.
 *
 * @returns {{ theme: string, toggleTheme: Function }}
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export default useTheme;
