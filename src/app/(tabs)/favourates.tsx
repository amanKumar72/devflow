import { useTheme } from "@/hooks/useTheme";
import { getFavouratesSnippits, initDatabase, toggleFavourate, type Snippit } from "@/utils/sqlite-queries";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = SymbolViewProps["name"];

const icons = {
  app: { ios: "terminal", android: "terminal", web: "terminal" },
  heart: { ios: "heart.fill", android: "favorite", web: "favorite" },
  notes: { ios: "text.alignleft", android: "notes", web: "notes" },
  search: { ios: "magnifyingglass", android: "search", web: "search" },
} satisfies Record<string, IconName>;

const baseFilters = ["All", "TypeScript", "Rust", "Python", "Go"];

function withAlpha(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  return `rgba(${parseInt(value.slice(0, 2), 16)}, ${parseInt(value.slice(2, 4), 16)}, ${parseInt(value.slice(4, 6), 16)}, ${alpha})`;
}

function Icon({ color, name, size = 22 }: { color: string; name: IconName; size?: number }) {
  return <SymbolView name={name} size={size} tintColor={color} />;
}

export default function Favourates() {
  const { colors, theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");
  const [favorites, setFavorites] = useState<Snippit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const border = withAlpha(colors.outlineVariant, theme === "dark" ? 0.42 : 0.72);
  const topBar = theme === "dark" ? withAlpha(colors.surface, 0.82) : withAlpha(colors.surface, 0.94);
  const filters = useMemo(() => Array.from(new Set([...baseFilters, ...favorites.map((item) => item.languageName).filter(Boolean) as string[]])), [favorites]);
  const visibleFavorites = activeFilter === "All" ? favorites : favorites.filter((item) => item.languageName === activeFilter);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      await initDatabase();
      setFavorites(await getFavouratesSnippits());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function removeFavorite(snippetId: number) {
    await toggleFavourate(snippetId);
    setFavorites(await getFavouratesSnippits());
  }

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <View style={{ alignItems: "center", backgroundColor: topBar, borderBottomColor: withAlpha(colors.outlineVariant, 0.3), borderBottomWidth: 1, flexDirection: "row", height: 64, justifyContent: "space-between", paddingHorizontal: 16 }}>
        <View style={{ alignItems: "center", columnGap: 10, flexDirection: "row" }}>
          <Icon color={colors.primary} name={icons.app} size={26} />
          <Text style={{ color: colors.onSurface, fontFamily: "Inter", fontSize: 24, fontWeight: "800" }}>DevFlow</Text>
        </View>
        <Icon color={colors.onSurfaceVariant} name={icons.search} size={28} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 112 }} style={{ flex: 1 }}>
        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
          <Text style={{ color: colors.onSurface, fontFamily: "Inter", fontSize: 36, fontWeight: "800", lineHeight: 44 }}>Favorites</Text>
          <Text style={{ backgroundColor: colors.surfaceContainerHigh, borderRadius: 6, color: colors.outline, fontFamily: "JetBrains Mono", fontSize: 12, paddingHorizontal: 12, paddingVertical: 8 }}>{favorites.length} Saved</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 28 }}>
          <View style={{ columnGap: 12, flexDirection: "row" }}>
            {filters.map((filter) => {
              const selected = filter === activeFilter;
              return (
                <Pressable key={filter} onPress={() => setActiveFilter(filter)} style={{ backgroundColor: selected ? colors.primaryContainer : colors.surfaceContainer, borderColor: selected ? colors.primaryContainer : border, borderRadius: 999, borderWidth: 1, minHeight: 42, paddingHorizontal: 20, justifyContent: "center" }}>
                  <Text style={{ color: selected ? colors.onPrimaryContainer : colors.onSurfaceVariant, fontFamily: "Inter", fontSize: 14, fontWeight: "700" }}>{filter}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {isLoading ? <ActivityIndicator color={colors.primary} style={{ marginTop: 48 }} /> : null}

        {!isLoading && visibleFavorites.length === 0 ? (
          <Text style={{ color: colors.onSurfaceVariant, fontFamily: "Inter", fontSize: 16, lineHeight: 24, marginTop: 48, textAlign: "center" }}>No favorite snippets yet.</Text>
        ) : null}

        <View style={{ gap: 20 }}>
          {visibleFavorites.map((item) => (
            <Pressable key={item.id} onPress={() => router.push(`/snippit/${item.id}`)} style={{ backgroundColor: colors.surface, borderColor: border, borderRadius: 12, borderWidth: 1, gap: 16, padding: 22 }}>
              <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ alignItems: "center", flexDirection: "row", gap: 14, flex: 1 }}>
                  <View style={{ alignItems: "center", backgroundColor: withAlpha(languageColor(item.languageName, colors), 0.12), borderColor: withAlpha(languageColor(item.languageName, colors), 0.28), borderRadius: 8, borderWidth: 1, height: 44, justifyContent: "center", width: 44 }}>
                    <Text style={{ color: languageColor(item.languageName, colors), fontFamily: "JetBrains Mono", fontWeight: "700" }}>{item.languageIcon ?? "{}"}</Text>
                  </View>
                  <Text numberOfLines={1} style={{ color: colors.onSurface, flex: 1, fontFamily: "Inter", fontSize: 22, fontWeight: "800" }}>{item.title}</Text>
                </View>
                <Pressable hitSlop={12} onPress={(event) => { event.stopPropagation(); removeFavorite(item.id); }}>
                  <Icon color={colors.primary} name={icons.heart} size={28} />
                </Pressable>
              </View>

              <View style={{ backgroundColor: theme === "dark" ? colors.surfaceContainerLowest : colors.surfaceContainerLow, borderColor: border, borderRadius: 8, borderWidth: 1, padding: 14 }}>
                <Text numberOfLines={3} style={{ color: colors.onSurfaceVariant, fontFamily: "JetBrains Mono", fontSize: 12, lineHeight: 18 }}>{item.code}</Text>
              </View>

              <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {parseTags(item.tags).slice(0, 2).map((tag) => <Chip key={tag} colors={colors} label={tag} />)}
                </View>
                <View style={{ alignItems: "center", flexDirection: "row", gap: 4 }}>
                  <Icon color={colors.outline} name={icons.notes} size={14} />
                  <Text style={{ color: colors.outline, fontFamily: "JetBrains Mono", fontSize: 12 }}>{item.code.split("\n").length}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Chip({ colors, label }: { colors: ReturnType<typeof useTheme>["colors"]; label: string }) {
  return <Text style={{ backgroundColor: colors.surfaceContainerHigh, borderRadius: 5, color: colors.onSurfaceVariant, fontFamily: "JetBrains Mono", fontSize: 12, paddingHorizontal: 10, paddingVertical: 6 }}>{label}</Text>;
}

function parseTags(value: string | null) {
  return value?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [];
}

function languageColor(language: string | undefined, colors: ReturnType<typeof useTheme>["colors"]) {
  if (language?.toLowerCase() === "rust") return "#dea584";
  if (language?.toLowerCase() === "python") return "#ffd43b";
  if (language?.toLowerCase() === "go") return "#00add8";
  return colors.primary;
}
