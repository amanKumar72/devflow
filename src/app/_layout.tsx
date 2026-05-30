import { Stack } from "expo-router";
import "./global.css";
import Provider from "@/context";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function RootStack() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + 5,
          paddingRight: insets.right + 5,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="snippit/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="snippit/create/index" options={{ headerShown: false }} />
      <Stack.Screen name="snippit/create/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider>
      <RootStack />
    </Provider>
  );
}
