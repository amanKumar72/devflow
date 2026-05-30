import { useTheme } from "@/hooks/useTheme";
import {
  getFavouratesSnippits,
  getProgrammingLanguages,
  initDatabase,
  toggleFavourate,
  type Snippit,
} from "@/utils/sqlite-queries";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SnippetCard } from "@/components/snippit-card";
import { withAlpha } from "@/utils/common";
import Header from "@/components/header";
import { SearchBar } from "react-native-screens";
import SearchInput from "@/components/search-input";

export default function Favourates() {
  const { colors, theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");
  const [favorites, setFavorites] = useState<Snippit[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredFavorites, setFilteredFavorites] = useState<Snippit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [programmingLanguages, setProgrammingLanguages] = useState<string[]>(
    [],
  );

  const border = withAlpha(
    colors.outlineVariant,
    theme === "dark" ? 0.42 : 0.72,
  );
  const filters = useMemo(
    () => Array.from(new Set(["All", ...programmingLanguages])),
    [programmingLanguages],
  );

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const languages = await getProgrammingLanguages();
      const newFavorites = await getFavouratesSnippits();
      setProgrammingLanguages(languages.map((item) => item.name));
      setFavorites(newFavorites);
      setFilteredFavorites(newFavorites);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function removeFavorite(snippetId: number) {
    await toggleFavourate(snippetId);
    const nextFavorites = await getFavouratesSnippits();
    setFavorites(nextFavorites);
    handleFilterChange(nextFavorites);
  }
  const handleFilterChange = (newFilteredFavorites?: Snippit[] | undefined) => {
    const snippitsForFilter = newFilteredFavorites || favorites;
    const visibleFavorites =
      activeFilter === "All"
        ? snippitsForFilter
        : snippitsForFilter.filter(
            (item) => item.languageName === activeFilter,
          );
    const newFavorites = visibleFavorites.filter(
      (item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.languageName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.tags?.toLocaleLowerCase().includes(searchText.toLowerCase()),
    );
    console.log(
      "handleChangeText",
      searchText,
      activeFilter,
      favorites.length,
      visibleFavorites.length,
      newFavorites.length,
    );
    setFilteredFavorites(newFavorites);
  };

  useEffect(() => {
    handleFilterChange();
  }, [activeFilter, searchText]);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header colors={colors} theme={theme} label="Favorites" />
      <SearchInput onChangeText={(text) => setSearchText(text)} />
      <View style={{ padding: 16, paddingBottom: 80, paddingTop: 8, flex: 1 }}>
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
                    borderColor: isSelected ? colors.primary : border,
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
          <ActivityIndicator color={colors.primary} style={{ marginTop: 48 }} />
        ) : null}

        {!isLoading && filteredFavorites.length === 0 ? (
          <Text
            style={{
              color: colors.onSurfaceVariant,
              fontFamily: "Inter",
              fontSize: 16,
              lineHeight: 24,
              marginTop: 48,
              textAlign: "center",
            }}
          >
            No favorite snippets yet.
          </Text>
        ) : null}
        <View style={{ flex: 1 }}>
          <FlatList
            data={filteredFavorites}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <SnippetCard
                key={item.id}
                borderColor={border}
                colors={colors}
                onFavorite={removeFavorite}
                snippet={item}
                theme={theme}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}
