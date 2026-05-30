import { useTheme } from "@/hooks/useTheme";
import {
  getSnippets,
  initDatabase,
  toggleFavourate,
  getProgrammingLanguages,
  type Snippit,
} from "@/utils/sqlite-queries";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Icon, icons, withAlpha } from "@/utils/common";
import { SnippetCard } from "@/components/snippit-card";
import Header from "@/components/header";
import SearchInput from "@/components/search-input";

export default function Snippits() {
  const { colors, theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [snippets, setSnippets] = useState<Snippit[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredSnippets, setFilteredSnippets] = useState<Snippit[]>([]);
  const [programmingLanguages, setProgrammingLanguages] = useState<string[]>(
    [],
  );

  const borderSubtle = withAlpha(
    colors.outlineVariant,
    theme === "dark" ? 0.42 : 0.72,
  );

  const filters = useMemo(() => {
    return Array.from(new Set(["All", ...programmingLanguages]));
  }, [programmingLanguages]);

  const loadSnippets = useCallback(async () => {
    setIsLoading(true);
    try {
      const nextSnippets = await getSnippets();
      const nextProgrammingLanguages = await getProgrammingLanguages();
      setProgrammingLanguages(nextProgrammingLanguages.map((pl) => pl.name));
      setSnippets(nextSnippets);
      setFilteredSnippets(nextSnippets);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSnippets();
    }, [loadSnippets]),
  );

  const handleFilterChange = (newFilteredSnippets?: Snippit[] | undefined) => {
    const snippitsForFilter = newFilteredSnippets || snippets;
    const visibleSnippets =
      activeFilter === "All"
        ? snippitsForFilter
        : snippitsForFilter.filter(
            (item) => item.languageName === activeFilter,
          );
    const newSnippets = visibleSnippets.filter(
      (item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.languageName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.tags?.toLocaleLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredSnippets(newSnippets);
  };

  useEffect(() => {
    handleFilterChange();
  }, [activeFilter, searchText]);

  async function handleToggleFavorite(snippetId: number) {
    await toggleFavourate(snippetId);
    const nextSnippets = await getSnippets();
    setSnippets(nextSnippets);
    handleFilterChange(nextSnippets);
  }

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header colors={colors} theme={theme} label="Snippits" />
      <SearchInput onChangeText={(text) => setSearchText(text)} />

      <View
        style={{
          paddingBottom: 80,
          paddingHorizontal: 16,
          paddingTop: 8,
          flex:1,
          backgroundColor: colors.background,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, marginBottom: 10 }}
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
                      ? withAlpha(
                          colors.primaryContainer,
                          theme === "dark" ? 0.28 : 1,
                        )
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
                      color: isSelected
                        ? colors.primary
                        : colors.onSurfaceVariant,
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

        {!isLoading && filteredSnippets.length === 0 ? (
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

          <View style={{flex:1}}>
            <FlatList
            data={filteredSnippets}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <SnippetCard
                key={item.id}
                borderColor={borderSubtle}
                colors={colors}
                onFavorite={() => handleToggleFavorite(item.id)}
                snippet={item}
                theme={theme}
              />
            )}
          />
          </View>
      </View>

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
