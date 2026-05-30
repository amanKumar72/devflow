import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";

type TabIconName = SymbolViewProps["name"];

const tabs: Record<string, { icon: TabIconName }> = {
  home: {
    icon: { ios: "house", android: "home", web: "home" },
  },
  snippits: {
    icon: { ios: "chevron.left.forwardslash.chevron.right", android: "code_blocks", web: "code_blocks" },
  },
  favourates: {
    icon: { ios: "heart", android: "favorite", web: "favorite" },
  },
  settings: {
    icon: { ios: "gearshape", android: "settings", web: "settings" },
  },
};

function withAlpha(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function TabIcon({
  activeBackground,
  activeColor,
  focused,
  inactiveColor,
  name,
}: {
  activeBackground: string;
  activeColor: string;
  focused: boolean;
  inactiveColor: string;
  name: TabIconName;
}) {
  return (
    <View
      style={{
        width: 72,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
        backgroundColor: focused ? activeBackground : "transparent",
      }}
    >
      <SymbolView
        name={name}
        size={26}
        tintColor={focused ? activeColor : inactiveColor}
        weight={focused ? "semibold" : "regular"}
      />
    </View>
  );
}

export default function TabsLayout() {
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const activeBackground =
    theme === "dark"
      ? withAlpha(colors.primaryContainer, 0.24)
      : colors.primaryContainer;
  const tabBarBackground =
    theme === "dark"
      ? withAlpha(colors.surface, 0.82)
      : withAlpha(colors.surfaceContainerLowest, 0.88);
  const borderColor =
    theme === "dark"
      ? withAlpha(colors.outlineVariant, 0.55)
      : withAlpha(colors.outlineVariant, 0.75);
  const inactiveColor =
    theme === "dark"
      ? "#5f6677"
      : colors.outline;

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.background,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 64 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingHorizontal: 16,
          backgroundColor: tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: borderColor,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          shadowColor: "#000",
          shadowOpacity: theme === "dark" ? 0.45 : 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: -6 },
          elevation: 18,
        },
        tabBarItemStyle: {
          height: 48,
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              activeBackground={activeBackground}
              activeColor={colors.primary}
              focused={focused}
              inactiveColor={inactiveColor}
              name={tabs.home.icon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="snippits"
        options={{
          title: "Snippets",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              activeBackground={activeBackground}
              activeColor={colors.primary}
              focused={focused}
              inactiveColor={inactiveColor}
              name={tabs.snippits.icon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favourates"
        options={{
          title: "Favorites",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              activeBackground={activeBackground}
              activeColor={colors.primary}
              focused={focused}
              inactiveColor={inactiveColor}
              name={tabs.favourates.icon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              activeBackground={activeBackground}
              activeColor={colors.primary}
              focused={focused}
              inactiveColor={inactiveColor}
              name={tabs.settings.icon}
            />
          ),
        }}
      />
    </Tabs>
  );
}
