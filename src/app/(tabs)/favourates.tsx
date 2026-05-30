import { useTheme } from "@/hooks/useTheme";
import { getFavouratesSnippits, getProgrammingLanguages, initDatabase, toggleFavourate, type Snippit } from "@/utils/sqlite-queries";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SnippetCard } from "@/components/snippit-card";
import { withAlpha } from "@/utils/common";
import Header from "@/components/header";

export default function Favourates() {
  const { colors, theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");
  const [favorites, setFavorites] = useState<Snippit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [programmingLanguages, setProgrammingLanguages] = useState<string[]>([]);

  const border = withAlpha(colors.outlineVariant, theme === "dark" ? 0.42 : 0.72);
  const filters = useMemo(() => Array.from(new Set(["All", ...programmingLanguages])), [programmingLanguages]);
  const visibleFavorites = activeFilter === "All" ? favorites : favorites.filter((item) => item.languageName === activeFilter);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      await initDatabase();
      const languages = await getProgrammingLanguages();
      setProgrammingLanguages(languages.map((item) => item.name));
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
      <Header colors={colors} theme={theme} label="Favorites" />
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
            <SnippetCard
              key={item.id}
              borderColor={border}
              colors={colors}
              onFavorite={removeFavorite}
              snippet={item}
              theme={theme}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
