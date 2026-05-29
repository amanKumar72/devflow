import type React from "react";
import {
  createContext,
  useEffect,
  useState
} from "react";
import { Appearance, type ColorSchemeName } from "react-native";
import { getItemFromAsyncStorage, setItemIntoAsyncStorage } from "@/utils/async-storage";

type Theme = "light" | "dark";

export const ThemeContext = createContext({
  theme: "dark" as Theme,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    const savedTheme = await getItemFromAsyncStorage("theme");
    const nextTheme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : "dark";

    setTheme(nextTheme);
    Appearance.setColorScheme(nextTheme as ColorSchemeName);
  }

  async function toggleTheme() {
    const nextTheme =
      theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    await setItemIntoAsyncStorage("theme", nextTheme);
    Appearance.setColorScheme(nextTheme);
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
