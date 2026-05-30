import { useTheme } from "@/hooks/useTheme";
import { radius, spacing, typography } from "@/utils/constants";
import { withAlpha } from "@/utils/common";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { TextInput, View, type TextInputProps, type ViewStyle } from "react-native";

type SearchInputProps = {
  onChangeText: (text: string) => void;
  value?: string;
  placeholder?: string;
  icon?: SymbolViewProps["name"];
  style?: ViewStyle;
  inputProps?: Omit<TextInputProps, "onChangeText" | "value" | "placeholder">;
};

const defaultIcon = {
  ios: "magnifyingglass",
  android: "search",
  web: "search",
} satisfies SymbolViewProps["name"];

export default function SearchInput({
  icon = defaultIcon,
  inputProps,
  onChangeText,
  placeholder = "Search snippets...",
  style,
  value,
}: SearchInputProps) {
  const { colors, theme } = useTheme();

  return (
    <View
      style={[
        {
          alignItems: "center",
          backgroundColor:
          theme === "dark" ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
          borderColor: withAlpha(colors.outlineVariant, theme === "dark" ? 0.5 : 0.75),
          borderRadius: radius.md,
          borderWidth: 1,
          columnGap: spacing.gutter,
          flexDirection: "row",
          minHeight: 56,
          paddingHorizontal: spacing.margin,
          marginVertical: 5
        },
        style,
      ]}
    >
      <SymbolView name={icon} size={22} tintColor={colors.outline} />
      <TextInput
        {...inputProps}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={withAlpha(colors.onSurfaceVariant, 0.56)}
        value={value}
        style={[
          {
            color: colors.onSurface,
            flex: 1,
            fontFamily: typography.bodyMd.fontFamily,
            fontSize: typography.bodyMd.fontSize,
            fontWeight: typography.bodyMd.fontWeight,
            lineHeight: typography.bodyMd.lineHeight,
            padding: 0,
          },
          inputProps?.style,
        ]}
      />
    </View>
  );
}
