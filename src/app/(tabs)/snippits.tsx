import { useTheme } from "@/hooks/useTheme";
import {
  getSnippets,
  initDatabase,
  toggleFavourate,
  type Snippit,
} from "@/utils/sqlite-queries";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = SymbolViewProps["name"];

const icons = {
  add: { ios: "plus", android: "add", web: "add" },
  app: { ios: "terminal", android: "terminal", web: "terminal" },
  favorite: { ios: "heart", android: "favorite", web: "favorite" },
  favoriteFilled: { ios: "heart.fill", android: "favorite", web: "favorite" },
  search: { ios: "magnifyingglass", android: "search", web: "search" },
} satisfies Record<string, IconName>;

const fallbackFilters = ["All", "TypeScript", "Rust", "Python", "Go"];

function withAlpha(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function Icon({
  color,
  name,
  size = 22,
}: {
  color: string;
  name: IconName;
  size?: number;
}) {
  return <SymbolView name={name} size={size} tintColor={color} />;
}

function parseCodePreview(code: string) {
  return code
    .split("\n")
    .slice(0, 4)
    .join("\n")
    .trim();
}

export default function Snippits() {
  const { colors, theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [snippets, setSnippets] = useState<Snippit[]>([]);

  const borderSubtle = withAlpha(colors.outlineVariant, theme === "dark" ? 0.42 : 0.72);
  const topBarBackground =
    theme === "dark" ? withAlpha(colors.surface, 0.82) : withAlpha(colors.surface, 0.94);

  const filters = useMemo(() => {
    const languageFilters = snippets
      .map((snippet) => snippet.languageName)
      .filter((value): value is string => Boolean(value));
    return Array.from(new Set([...fallbackFilters, ...languageFilters]));
  }, [snippets]);

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
              onPress={() => router.push(`/snippit/${snippet.id}`)}
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

function SnippetCard({
  borderColor,
  colors,
  onFavorite,
  onPress,
  snippet,
  theme,
}: {
  borderColor: string;
  colors: ReturnType<typeof useTheme>["colors"];
  onFavorite: () => void;
  onPress: () => void;
  snippet: Snippit;
  theme: "light" | "dark";
}) {
  const isFavorite = snippet.isFavorite === 1;

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: theme === "dark" ? colors.surface : colors.surfaceContainerLowest,
        borderColor,
        borderRadius: 12,
        borderWidth: 1,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          alignItems: "center",
          borderBottomColor: withAlpha(colors.outlineVariant, 0.3),
          borderBottomWidth: 1,
          columnGap: 16,
          flexDirection: "row",
          padding: 20,
        }}
      >
        <View
          style={{
            alignItems: "center",
            backgroundColor: withAlpha(languageColor(snippet.languageName, colors), 0.12),
            borderColor: withAlpha(languageColor(snippet.languageName, colors), 0.28),
            borderRadius: 8,
            borderWidth: 1,
            height: 56,
            justifyContent: "center",
            width: 56,
          }}
        >
          <Text
            style={{
              color: languageColor(snippet.languageName, colors),
              fontFamily: "JetBrains Mono",
              fontSize: 18,
              fontWeight: "700",
              lineHeight: 24,
            }}
          >
            {snippet.languageIcon ?? "{}"}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              color: colors.onSurface,
              fontFamily: "Inter",
              fontSize: 24,
              fontWeight: "700",
              lineHeight: 30,
            }}
          >
            {snippet.title}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: colors.onSurfaceVariant,
              fontFamily: "Inter",
              fontSize: 18,
              lineHeight: 26,
              marginTop: 2,
            }}
          >
            {snippet.languageName ?? "Snippet"} • {snippet.code.split("\n").length} lines
          </Text>
        </View>

        <Pressable
          hitSlop={12}
          onPress={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
          style={{
            alignItems: "center",
            borderColor: withAlpha(isFavorite ? colors.error : colors.outlineVariant, 0.48),
            borderRadius: 999,
            borderWidth: 1,
            height: 40,
            justifyContent: "center",
            width: 40,
          }}
        >
          <Icon
            color={isFavorite ? colors.error : colors.outline}
            name={isFavorite ? icons.favoriteFilled : icons.favorite}
            size={22}
          />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: theme === "dark" ? "#111111" : colors.surfaceContainerLow,
            minWidth: "100%",
            paddingHorizontal: 20,
            paddingVertical: 16,
          }}
        >
          {parseCodePreview(snippet.code)
            .split("\n")
            .map((line, index) => (
              <Text
                key={`${snippet.id}-${index}`}
                style={{
                  color: colors.onSurfaceVariant,
                  fontFamily: "JetBrains Mono",
                  fontSize: 14,
                  lineHeight: 22,
                }}
              >
                <Text style={{ color: withAlpha(colors.outline, 0.52) }}>
                  {index + 1}  </Text>
                {line || " "}
              </Text>
            ))}
        </View>
      </ScrollView>
    </Pressable>
  );
}

function languageColor(language: string | undefined, colors: ReturnType<typeof useTheme>["colors"]) {
  const normalized = language?.toLowerCase();

  if (normalized === "typescript") {
    return "#8fb4ff";
  }
  if (normalized === "rust") {
    return "#dea584";
  }
  if (normalized === "python") {
    return colors.tertiary;
  }
  if (normalized === "go") {
    return "#00add8";
  }

  return colors.primary;
}
