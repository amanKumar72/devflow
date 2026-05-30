import { useTheme } from "@/hooks/useTheme";
import { getFavouratesSnippits, getSnippets, initDatabase, type Snippit } from "@/utils/sqlite-queries";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = SymbolViewProps["name"];

const icons = {
  add: { ios: "plus", android: "add", web: "add" },
  app: { ios: "terminal", android: "terminal", web: "terminal" },
  bolt: { ios: "bolt", android: "bolt", web: "bolt" },
  database: { ios: "server.rack", android: "database", web: "database" },
  search: { ios: "magnifyingglass", android: "search", web: "search" },
} satisfies Record<string, IconName>;

function withAlpha(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  return `rgba(${parseInt(value.slice(0, 2), 16)}, ${parseInt(value.slice(2, 4), 16)}, ${parseInt(value.slice(4, 6), 16)}, ${alpha})`;
}

function Icon({ color, name, size = 22 }: { color: string; name: IconName; size?: number }) {
  return <SymbolView name={name} size={size} tintColor={color} />;
}

export default function Home() {
  const { colors, theme } = useTheme();
  const [favorites, setFavorites] = useState<Snippit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recent, setRecent] = useState<Snippit[]>([]);

  const border = withAlpha(colors.outlineVariant, theme === "dark" ? 0.42 : 0.7);
  const topBar = theme === "dark" ? withAlpha(colors.surface, 0.82) : withAlpha(colors.surface, 0.94);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      await initDatabase();
      const [all, favs] = await Promise.all([getSnippets(), getFavouratesSnippits()]);
      setRecent(all.slice(0, 6));
      setFavorites(favs.slice(0, 4));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header colors={colors} topBar={topBar} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 112 }} style={{ flex: 1 }}>
        <View style={{ alignItems: "center", backgroundColor: colors.surfaceContainerLow, borderColor: border, borderRadius: 16, borderWidth: 1, columnGap: 12, flexDirection: "row", minHeight: 76, paddingHorizontal: 18 }}>
          <Icon color={colors.outline} name={icons.bolt} size={24} />
          <Text style={{ color: withAlpha(colors.onSurfaceVariant, 0.64), flex: 1, fontFamily: "JetBrains Mono", fontSize: 18 }}>
            Search commands, snippets, or files...
          </Text>
        </View>

        <SectionTitle action="View All" onAction={() => router.push("/snippits")} title="Favorites" colors={colors} />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          {(favorites.length ? favorites : recent.slice(0, 4)).map((item) => (
            <Pressable key={item.id} onPress={() => router.push(`/snippit/${item.id}`)} style={{ backgroundColor: colors.surface, borderColor: border, borderRadius: 10, borderWidth: 1, minHeight: 136, padding: 16, width: "47%" }}>
              <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 18 }}>
                <View style={{ alignItems: "center", backgroundColor: withAlpha(languageColor(item.languageName, colors), 0.12), borderRadius: 6, height: 42, justifyContent: "center", width: 42 }}>
                  <Text style={{ color: languageColor(item.languageName, colors), fontFamily: "JetBrains Mono", fontWeight: "700" }}>{item.languageIcon ?? "TS"}</Text>
                </View>
                {item.isFavorite ? <View style={{ backgroundColor: colors.tertiary, borderRadius: 999, height: 10, width: 10 }} /> : null}
              </View>
              <Text numberOfLines={1} style={{ color: colors.onSurface, fontFamily: "Inter", fontSize: 18, fontWeight: "700" }}>{item.title}</Text>
              <Text numberOfLines={1} style={{ color: colors.onSurfaceVariant, fontFamily: "JetBrains Mono", fontSize: 12, marginTop: 4 }}>
                {item.languageName ?? "Snippet"} • {item.code.split("\n").length} lines
              </Text>
            </Pressable>
          ))}
        </View>

        <SectionTitle title="Recent Snippets" colors={colors} />
        {isLoading ? <ActivityIndicator color={colors.primary} style={{ marginTop: 32 }} /> : null}
        <View style={{ gap: 10 }}>
          {recent.map((item) => (
            <Pressable key={item.id} onPress={() => router.push(`/snippit/${item.id}`)} style={{ backgroundColor: colors.surface, borderColor: border, borderRadius: 10, borderWidth: 1, flexDirection: "row", gap: 14, padding: 16 }}>
              <View style={{ alignItems: "center", backgroundColor: withAlpha(languageColor(item.languageName, colors), 0.14), borderColor: withAlpha(languageColor(item.languageName, colors), 0.28), borderRadius: 8, borderWidth: 1, height: 52, justifyContent: "center", width: 52 }}>
                <Text style={{ color: languageColor(item.languageName, colors), fontFamily: "JetBrains Mono", fontSize: 16, fontWeight: "700" }}>{item.languageIcon ?? "{}"}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ color: colors.onSurface, fontFamily: "Inter", fontSize: 18, fontWeight: "700" }}>{item.title}</Text>
                <Text numberOfLines={3} style={{ color: colors.onSurfaceVariant, fontFamily: "JetBrains Mono", fontSize: 12, lineHeight: 18, marginTop: 8 }}>{item.code}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <Pressable onPress={() => router.push("/snippit/create")} style={{ alignItems: "center", backgroundColor: colors.primaryContainer, borderRadius: 999, bottom: 88, height: 64, justifyContent: "center", position: "absolute", right: 24, width: 64 }}>
        <Icon color={colors.onPrimaryContainer} name={icons.add} size={30} />
      </Pressable>
    </View>
  );
}

function Header({ colors, topBar }: { colors: ReturnType<typeof useTheme>["colors"]; topBar: string }) {
  return (
    <View style={{ alignItems: "center", backgroundColor: topBar, borderBottomColor: withAlpha(colors.outlineVariant, 0.3), borderBottomWidth: 1, flexDirection: "row", height: 64, justifyContent: "space-between", paddingHorizontal: 16 }}>
      <Icon color={colors.primary} name={icons.app} size={26} />
      <Text style={{ color: colors.onSurface, fontFamily: "Inter", fontSize: 24, fontWeight: "800" }}>DevFlow</Text>
      <Icon color={colors.onSurfaceVariant} name={icons.search} size={28} />
    </View>
  );
}

function SectionTitle({ action, colors, onAction, title }: { action?: string; colors: ReturnType<typeof useTheme>["colors"]; onAction?: () => void; title: string }) {
  return (
    <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 12, marginTop: 32 }}>
      <Text style={{ color: colors.onSurface, fontFamily: "Inter", fontSize: 24, fontWeight: "800" }}>{title}</Text>
      {action ? <Pressable onPress={onAction}><Text style={{ color: colors.primary, fontFamily: "Inter", fontSize: 11, fontWeight: "800", letterSpacing: 1.4, textTransform: "uppercase" }}>{action}</Text></Pressable> : null}
    </View>
  );
}

function languageColor(language: string | undefined, colors: ReturnType<typeof useTheme>["colors"]) {
  if (language?.toLowerCase() === "rust") return "#dea584";
  if (language?.toLowerCase() === "python") return colors.tertiary;
  if (language?.toLowerCase() === "go") return "#00add8";
  return colors.primary;
}
