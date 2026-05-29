import { ThemeContext } from "@/context/themeContext";
import { useContext } from "react";

export function useTheme() {
  return useContext(ThemeContext);
}