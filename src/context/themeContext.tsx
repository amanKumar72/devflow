import type React from "react";
import {
  createContext,
  useEffect,
  useState
} from "react";
import { Appearance, type ColorSchemeName } from "react-native";
import { getItemFromAsyncStorage, setItemIntoAsyncStorage } from "@/utils/async-storage";
import { colors } from "@/utils/constants";

type Theme = "light" | "dark";
type ThemeColors = typeof colors[Theme];
type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
  colors: colors.dark,
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
        colors: colors[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
