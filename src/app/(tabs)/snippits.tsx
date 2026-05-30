import { useTheme } from "@/hooks/useTheme";
import {
  getSnippets,
  initDatabase,
  toggleFavourate,
  getProgrammingLanguages,
  type Snippit,
  deleteData,
} from "@/utils/sqlite-queries";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { parseCodePreview,Icon,IconName,icons,withAlpha,formatDate,parseTags,normalizeParam,languageColor } from "@/utils/common";
import { SnippetCard } from "@/components/snippit-card";

export default function Snippits() {
  const { colors, theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [snippets, setSnippets] = useState<Snippit[]>([]);
  const [programmingLanguages, setProgrammingLanguages] = useState<string[]>([]);

  const borderSubtle = withAlpha(colors.outlineVariant, theme === "dark" ? 0.42 : 0.72);
  const topBarBackground =
    theme === "dark" ? withAlpha(colors.surface, 0.82) : withAlpha(colors.surface, 0.94);

  const filters = useMemo(() => {
    return Array.from(new Set(["All", ...programmingLanguages]));
  }, [programmingLanguages]);

  const visibleSnippets = useMemo(() => {
    if (activeFilter === "All") {
      return snippets;
    }

    return snippets.filter((snippet) => snippet.languageName === activeFilter);
  }, [activeFilter, snippets]);

  const loadSnippets = useCallback(async () => {
    setIsLoading(true);
    try {
      await initDatabase();
      const nextSnippets = await getSnippets();
      const nextProgrammingLanguages = await getProgrammingLanguages();
      console.log(nextProgrammingLanguages)
      setProgrammingLanguages(nextProgrammingLanguages.map((pl) => pl.name));
      setSnippets(nextSnippets);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSnippets();
    }, [loadSnippets])
  );

  async function handleToggleFavorite(snippetId: number) {
    await toggleFavourate(snippetId);
    const nextSnippets = await getSnippets();
    setSnippets(nextSnippets);
  }

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <View
        style={{
          alignItems: "center",
          backgroundColor: topBarBackground,
          borderBottomColor: withAlpha(colors.outlineVariant, 0.3),
          borderBottomWidth: 1,
          flexDirection: "row",
          height: 64,
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
      >
        <View style={{ alignItems: "center", columnGap: 10, flexDirection: "row" }}>
          <Icon color={colors.primary} name={icons.app} size={28} />
          <Text
            style={{
              color: colors.onSurface,
              fontFamily: "Inter",
              fontSize: 28,
              fontWeight: "700",
              lineHeight: 34,
            }}
          >
            All Snippets
          </Text>
        </View>

        <Icon color={colors.onSurfaceVariant} name={icons.search} size={30} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 112,
          paddingHorizontal: 16,
          paddingTop: 28,
        }}
        style={{ backgroundColor: colors.background, flex: 1 }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, marginBottom: 28 }}
        >
          <View style={{ columnGap: 12, flexDirection: "row" }}>
            {filters.map((filter) => {
              const isSelected = filter === activeFilter;

              return (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  style={{
                    alignItems: "center",
                    backgroundColor: isSelected
                      ? withAlpha(colors.primaryContainer, theme === "dark" ? 0.28 : 1)
                      : "transparent",
                    borderColor: isSelected ? colors.primary : borderSubtle,
                    borderRadius: 999,
                    borderWidth: 1,
                    justifyContent: "center",
                    minHeight: 44,
                    paddingHorizontal: 22,
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? colors.primary : colors.onSurfaceVariant,
                      fontFamily: "Inter",
                      fontSize: 14,
                      fontWeight: "700",
                      lineHeight: 20,
                    }}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {isLoading ? (
          <View style={{ alignItems: "center", paddingTop: 96 }}>
            <ActivityIndicator color={colors.primary} />
            <Text
              style={{
                color: colors.onSurfaceVariant,
                fontFamily: "Inter",
                fontSize: 14,
                marginTop: 8,
              }}
            >
              Loading snippets
            </Text>
          </View>
        ) : null}

        {!isLoading && visibleSnippets.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              borderColor: borderSubtle,
              borderRadius: 12,
              borderWidth: 1,
              padding: 24,
            }}
          >
            <Text
              style={{
                color: colors.onSurface,
                fontFamily: "Inter",
                fontSize: 20,
                fontWeight: "700",
                lineHeight: 28,
                textAlign: "center",
              }}
            >
              No snippets yet
            </Text>
            <Text
              style={{
                color: colors.onSurfaceVariant,
                fontFamily: "Inter",
                fontSize: 14,
                lineHeight: 20,
                marginTop: 4,
                textAlign: "center",
              }}
            >
              Create your first reusable snippet.
            </Text>
          </View>
        ) : null}

        <View style={{ rowGap: 28 }}>
          {visibleSnippets.map((snippet) => (
            <SnippetCard
              borderColor={borderSubtle}
              colors={colors}
              key={snippet.id}
              onFavorite={() => handleToggleFavorite(snippet.id)}
              snippet={snippet}
              theme={theme}
            />
          ))}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.push("/snippit/create")}
        style={{
          alignItems: "center",
          backgroundColor: colors.primaryContainer,
          borderRadius: 18,
          bottom: 88,
          height: 64,
          justifyContent: "center",
          position: "absolute",
          right: 16,
          shadowColor: colors.primaryContainer,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.34,
          shadowRadius: 18,
          width: 64,
          elevation: 12,
        }}
      >
        <Icon color={colors.onPrimaryContainer} name={icons.add} size={30} />
      </Pressable>
    </View>
  );
}