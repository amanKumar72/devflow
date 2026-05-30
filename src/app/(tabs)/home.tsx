import { useTheme } from "@/hooks/useTheme";
import { getFavouratesSnippits, getSnippets, initDatabase, type Snippit } from "@/utils/sqlite-queries";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { IconName,withAlpha, icons, Icon, languageColor } from "@/utils/common";
import Header from "@/components/header";

export default function Home() {
  const { colors, theme } = useTheme();
  const [favorites, setFavorites] = useState<Snippit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recent, setRecent] = useState<Snippit[]>([]);

  const border = withAlpha(colors.outlineVariant, theme === "dark" ? 0.42 : 0.7);

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
      <Header colors={colors} theme={theme} label="Home" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 112, paddingTop: 5 }} style={{ flex: 1 }}>
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

function SectionTitle({ action, colors, onAction, title }: { action?: string; colors: ReturnType<typeof useTheme>["colors"]; onAction?: () => void; title: string }) {
  return (
    <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 6, marginTop: 12 }}>
      <Text style={{ color: colors.onSurface, fontFamily: "Inter", fontSize: 24, fontWeight: "800" }}>{title}</Text>
      {action ? <Pressable onPress={onAction}><Text style={{ color: colors.primary, fontFamily: "Inter", fontSize: 11, fontWeight: "800", letterSpacing: 1.4, textTransform: "uppercase" }}>{action}</Text></Pressable> : null}
    </View>
  );
}
