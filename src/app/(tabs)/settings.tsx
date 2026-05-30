import { useTheme } from "@/hooks/useTheme";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = SymbolViewProps["name"];

const icons = {
  app: { ios: "terminal", android: "terminal", web: "terminal" },
  bot: { ios: "cpu", android: "smart_toy", web: "smart_toy" },
  box: { ios: "shippingbox", android: "deployed_code", web: "deployed_code" },
  cache: { ios: "internaldrive", android: "hard_drive_2", web: "hard_drive_2" },
  chevron: { ios: "chevron.right", android: "chevron_right", web: "chevron_right" },
  flask: { ios: "flask", android: "science", web: "science" },
  palette: { ios: "paintpalette", android: "palette", web: "palette" },
  search: { ios: "magnifyingglass", android: "search", web: "search" },
  text: { ios: "textformat.size", android: "text_fields", web: "text_fields" },
} satisfies Record<string, IconName>;

function withAlpha(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  return `rgba(${parseInt(value.slice(0, 2), 16)}, ${parseInt(value.slice(2, 4), 16)}, ${parseInt(value.slice(4, 6), 16)}, ${alpha})`;
}

function Icon({ color, name, size = 22 }: { color: string; name: IconName; size?: number }) {
  return <SymbolView name={name} size={size} tintColor={color} />;
}

export default function Settings() {
  const { colors, theme, toggleTheme } = useTheme();
  const [experimental, setExperimental] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const border = withAlpha(colors.outlineVariant, theme === "dark" ? 0.35 : 0.7);
  const topBar = theme === "dark" ? withAlpha(colors.surface, 0.82) : withAlpha(colors.surface, 0.94);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <View style={{ alignItems: "center", backgroundColor: topBar, borderBottomColor: withAlpha(colors.outlineVariant, 0.3), borderBottomWidth: 1, flexDirection: "row", height: 64, justifyContent: "space-between", paddingHorizontal: 16 }}>
        <Icon color={colors.onSurfaceVariant} name={icons.app} size={26} />
        <Text style={{ color: colors.onSurface, fontFamily: "Inter", fontSize: 24, fontWeight: "800" }}>DevFlow</Text>
        <Icon color={colors.onSurfaceVariant} name={icons.search} size={28} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 112 }} style={{ flex: 1 }}>
        <Text style={{ color: colors.onSurface, fontFamily: "Inter", fontSize: 36, fontWeight: "800", lineHeight: 44 }}>Settings</Text>
        <Text style={{ color: colors.onSurfaceVariant, fontFamily: "Inter", fontSize: 16, lineHeight: 24, marginBottom: 28, marginTop: 6 }}>Manage environment and preferences.</Text>

        <Panel border={border} colors={colors}>
          <Label colors={colors} text="Appearance" />
          <Row colors={colors} icon={icons.palette} label="Theme">
            <View style={{ backgroundColor: colors.surfaceContainerLow, borderColor: border, borderRadius: 10, borderWidth: 1, flexDirection: "row", padding: 4 }}>
              {["Dark", "Light"].map((label) => {
                const selected = (label.toLowerCase() as "dark" | "light") === theme;
                return (
                  <Pressable key={label} onPress={selected ? undefined : toggleTheme} style={{ backgroundColor: selected ? colors.surfaceContainerHigh : "transparent", borderRadius: 8, minWidth: 74, paddingHorizontal: 14, paddingVertical: 8 }}>
                    <Text style={{ color: selected ? colors.onSurface : colors.outline, fontFamily: "Inter", fontSize: 14, textAlign: "center" }}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Row>
          <Divider border={border} />
          <Row colors={colors} icon={icons.text} label="Font Size">
            <View style={{ alignItems: "center", backgroundColor: colors.surfaceContainerLow, borderColor: border, borderRadius: 10, borderWidth: 1, flexDirection: "row", gap: 14, padding: 8 }}>
              <Pressable onPress={() => setFontSize((value) => Math.max(10, value - 1))}><Text style={{ color: colors.outline, fontSize: 22 }}>−</Text></Pressable>
              <Text style={{ color: colors.primary, fontFamily: "JetBrains Mono", fontSize: 14 }}>{fontSize}</Text>
              <Pressable onPress={() => setFontSize((value) => Math.min(24, value + 1))}><Text style={{ color: colors.outline, fontSize: 22 }}>+</Text></Pressable>
            </View>
          </Row>
          <View style={{ backgroundColor: colors.surfaceContainerLow, borderColor: border, borderRadius: 10, borderWidth: 1, marginTop: 16, padding: 14 }}>
            <Text style={{ color: colors.onSurfaceVariant, fontFamily: "JetBrains Mono", fontSize, lineHeight: fontSize + 8 }}>
              <Text style={{ color: colors.tertiary }}>function</Text> <Text style={{ color: colors.primary }}>renderSettings</Text>() {"{"}{"\n"}  <Text style={{ color: colors.secondary }}>console</Text>.log(<Text style={{ color: colors.tertiary }}>"Optimized"</Text>);{"\n"}{"}"}
            </Text>
          </View>
        </Panel>

        <Panel border={border} colors={colors}>
          <Label colors={colors} text="Intelligence" />
          <Row colors={colors} icon={icons.bot} label="Provider">
            <Icon color={colors.outline} name={icons.chevron} size={22} />
          </Row>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginLeft: 48, marginTop: 12 }}>
            {["OpenAI", "Claude", "Local"].map((provider, index) => (
              <Text key={provider} style={{ backgroundColor: index === 0 ? withAlpha(colors.primary, 0.12) : colors.surfaceContainerLow, borderColor: index === 0 ? withAlpha(colors.primary, 0.42) : border, borderRadius: 6, borderWidth: 1, color: index === 0 ? colors.primary : colors.outline, fontFamily: "JetBrains Mono", fontSize: 12, paddingHorizontal: 10, paddingVertical: 6 }}>{index === 0 ? "• " : ""}{provider}</Text>
            ))}
          </View>
        </Panel>

        <Panel border={border} colors={colors}>
          <Label colors={colors} muted text="Data" />
          <Row colors={colors} icon={icons.cache} label="Cache Storage">
            <Icon color={colors.outline} name={icons.chevron} size={22} />
          </Row>
          <View style={{ marginLeft: 48, marginTop: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: colors.outline, fontFamily: "JetBrains Mono", fontSize: 12 }}>2.4 GB</Text>
              <Text style={{ color: colors.outline, fontFamily: "JetBrains Mono", fontSize: 12 }}>5.0 GB</Text>
            </View>
            <View style={{ backgroundColor: colors.surfaceContainerHigh, borderRadius: 999, height: 7, marginTop: 8, overflow: "hidden" }}>
              <View style={{ backgroundColor: colors.secondary, borderRadius: 999, height: 7, width: "48%" }} />
            </View>
          </View>
        </Panel>

        <Panel border={border} colors={colors}>
          <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ alignItems: "center", flex: 1, flexDirection: "row", gap: 14 }}>
              <IconBox colors={colors} icon={icons.flask} tone={colors.secondary} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.onSurface, fontFamily: "Inter", fontSize: 20, lineHeight: 28 }}>Experimental Features</Text>
                <Text style={{ color: colors.onSurfaceVariant, fontFamily: "Inter", fontSize: 14, lineHeight: 20 }}>Enable beta tools and unstable APIs.</Text>
              </View>
            </View>
            <Pressable onPress={() => setExperimental((value) => !value)} style={{ alignItems: "center", backgroundColor: experimental ? colors.primary : colors.surfaceContainerHigh, borderRadius: 999, height: 30, justifyContent: "center", padding: 3, width: 54 }}>
              <View style={{ alignSelf: experimental ? "flex-end" : "flex-start", backgroundColor: experimental ? colors.onPrimary : colors.outline, borderRadius: 999, height: 24, width: 24 }} />
            </Pressable>
          </View>
        </Panel>

        <View style={{ alignItems: "center", marginTop: 36 }}>
          <Icon color={withAlpha(colors.outline, 0.55)} name={icons.box} size={26} />
          <Text style={{ color: withAlpha(colors.outline, 0.7), fontFamily: "JetBrains Mono", fontSize: 12, marginTop: 8 }}>DevFlow v2.4.1 (Build 8902)</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Panel({ border, children, colors }: { border: string; children: React.ReactNode; colors: ReturnType<typeof useTheme>["colors"] }) {
  return <View style={{ backgroundColor: colors.surface, borderColor: border, borderRadius: 14, borderWidth: 1, marginBottom: 24, padding: 24 }}>{children}</View>;
}

function Label({ colors, muted, text }: { colors: ReturnType<typeof useTheme>["colors"]; muted?: boolean; text: string }) {
  return <Text style={{ color: muted ? colors.outline : colors.primary, fontFamily: "Inter", fontSize: 11, fontWeight: "800", letterSpacing: 1.2, marginBottom: 18, textTransform: "uppercase" }}>{text}</Text>;
}

function Row({ children, colors, icon, label }: { children: React.ReactNode; colors: ReturnType<typeof useTheme>["colors"]; icon: IconName; label: string }) {
  return <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}><View style={{ alignItems: "center", flexDirection: "row", gap: 14 }}><IconBox colors={colors} icon={icon} tone={colors.primary} /><Text style={{ color: colors.onSurface, fontFamily: "Inter", fontSize: 20 }}>{label}</Text></View>{children}</View>;
}

function IconBox({ colors, icon, tone }: { colors: ReturnType<typeof useTheme>["colors"]; icon: IconName; tone: string }) {
  return <View style={{ alignItems: "center", backgroundColor: withAlpha(tone, 0.12), borderRadius: 8, height: 42, justifyContent: "center", width: 42 }}><Icon color={tone} name={icon} size={22} /></View>;
}

function Divider({ border }: { border: string }) {
  return <View style={{ backgroundColor: border, height: 1, marginVertical: 22 }} />;
}
