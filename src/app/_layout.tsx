import { Stack } from "expo-router";
import "./global.css";
import { ThemeProvider } from "@/context/themeContext";
import { useTheme } from "@/hooks/useTheme";

export default function RootLayout() {
  const theme = useTheme();

  return (
    <ThemeProvider>
      <Stack screenOptions={{
        headerShown: false,
      }} />
    </ThemeProvider>
  );
}
