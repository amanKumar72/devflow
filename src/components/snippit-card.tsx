import { useTheme } from "@/hooks/useTheme";
import { Snippit } from "@/utils/sqlite-queries";
import { useRouter } from "expo-router";
import { Pressable, View, Text } from "react-native";
import { languageColor, parseTags, withAlpha, Icon, icons } from "@/utils/common";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Chip from './chip';

export function SnippetCard({
  borderColor,
  colors,
  onFavorite,
  snippet,
  theme,
}: {
  borderColor: string;
  colors: ReturnType<typeof useTheme>["colors"];
  onFavorite: (id: number) => void;
  snippet: Snippit;
 theme: ReturnType<typeof useTheme>["theme"]; 
}) {
  const router = useRouter();
  const isFavorite = snippet.isFavorite === 1;

  return (
    <Pressable key={snippet.id} onPress={() => router.push(`/snippit/${snippet.id}`)} style={{ backgroundColor: colors.surface, borderColor:  borderColor, borderRadius: 12, borderWidth: 1, gap: 16, padding: 22 }}>
              <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ alignItems: "center", flexDirection: "row", gap: 14, flex: 1 }}>
                  <View style={{ alignItems: "center", backgroundColor: withAlpha(languageColor(snippet.languageName, colors), 0.12), borderColor: withAlpha(languageColor(snippet.languageName, colors), 0.28), borderRadius: 8, borderWidth: 1, height: 44, justifyContent: "center", width: 44 }}>
                    <Text style={{ color: languageColor(snippet.languageName, colors), fontFamily: "JetBrains Mono", fontWeight: "700" }}>{snippet.languageIcon ?? "{}"}</Text>
                  </View>
                  <Text numberOfLines={1} style={{ color: colors.onSurface, flex: 1, fontFamily: "Inter", fontSize: 22, fontWeight: "800" }}>{snippet.title}</Text>
                </View>
                <Pressable hitSlop={12} onPress={(event) => { event.stopPropagation(); onFavorite(snippet.id); }}>
                  {isFavorite?<MaterialIcons name="favorite" size={24} color={colors.primary}  />:<MaterialIcons name="favorite-outline" size={24} color={withAlpha(colors.outline, 0.52)}  />}
                </Pressable>
              </View>

              <View style={{ backgroundColor: theme === "dark" ? colors.surfaceContainerLowest : colors.surfaceContainerLow, borderColor: borderColor, borderRadius: 8, borderWidth: 1, padding: 14 }}>
                <Text numberOfLines={3} style={{ color: colors.onSurfaceVariant, fontFamily: "JetBrains Mono", fontSize: 12, lineHeight: 18 }}>{snippet.code}</Text>
              </View>

              <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {parseTags(snippet.tags).slice(0, 2).map((tag) => <Chip key={tag} colors={colors} label={tag} />)}
                </View>
                <View style={{ alignItems: "center", flexDirection: "row", gap: 4 }}>
                  <Icon color={colors.outline} name={icons.notes} size={14} />
                  <Text style={{ color: colors.outline, fontFamily: "JetBrains Mono", fontSize: 12 }}>{snippet.code.split("\n").length}</Text>
                </View>
              </View>
            </Pressable>
  );
}
