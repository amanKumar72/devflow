import { useTheme } from "@/hooks/useTheme";
import {
  getSnippets,
  getSnippetsById,
  initDatabase,
  toggleFavourate,
  type Snippit as SnippitRecord,
} from "@/utils/sqlite-queries";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { formatDate ,IconName, Icon , parseTags, normalizeParam, icons, withAlpha} from "@/utils/common";
import { explainCode } from "@/utils/geminiAI";
import { shareFile } from "@/utils/file-system";
import { getItemFromAsyncStorage, setItemIntoAsyncStorage } from "@/utils/async-storage";
import { DOWNLOAD_MIME_TYPES } from "@/utils/constants";
const fallbackSnippet = {
  title: "Snippet not found",
  code: "// This snippet could not be loaded.",
  languageName: "Unknown",
  languageIcon: "{}",
  tags: "",
  updatedAt: "",
};

export default function Snippit() {
  const { colors, theme } = useTheme();
  const params = useLocalSearchParams();
  const snippetId = normalizeParam(params.id);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [snippet, setSnippet] = useState<SnippitRecord | null>(null);
  const [related, setRelated] = useState<SnippitRecord[]>([]);
  const [aiResponse, setAiResponse] = useState('')
  const displaySnippet = snippet ?? fallbackSnippet;
  const defaultShareType = useMemo(() => {
    const language = displaySnippet.languageName?.toLowerCase();

    return (
      DOWNLOAD_MIME_TYPES.find((item) => item.label.toLowerCase() === language) ??
      DOWNLOAD_MIME_TYPES[0]
    );
  }, [displaySnippet.languageName]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareExtension, setShareExtension] = useState<string>(defaultShareType.extension);
  const [shareMimeType, setShareMimeType] = useState<string>(defaultShareType.mimeType);

  const tags = useMemo(() => parseTags(displaySnippet.tags), [displaySnippet.tags]);
  const lines = useMemo(() => [displaySnippet.code], [displaySnippet.code]);

  const borderSubtle = withAlpha(colors.outlineVariant, theme === "dark" ? 0.46 : 0.72);
  const topBarBackground =
    theme === "dark" ? withAlpha(colors.surface, 0.82) : withAlpha(colors.surface, 0.94);
  const panelBackground =
    theme === "dark" ? colors.surfaceContainerLowest : colors.surfaceContainerLow;

  useEffect(() => {
    let isMounted = true;

    async function loadSnippet() {
      try {
        if (!snippetId) {
          setError("Missing snippet id.");
          return;
        }

        const nextSnippet = await getSnippetsById(snippetId);
        const allSnippets = await getSnippets();
        let key = `explaination:${snippetId}`
        let explained = await getItemFromAsyncStorage(key)
        console.log("from store", explained)
        if(!explained) {
          explained = await explainCode(nextSnippet?.code || '')
          await setItemIntoAsyncStorage(key, explained)
        }
        if (!isMounted) {
          return;
        }

        setSnippet(nextSnippet ?? null);
        setAiResponse(explained)
        setRelated(allSnippets.filter((item) => item.id !== snippetId).slice(0, 6));

        if (!nextSnippet) {
          setError("This snippet does not exist yet.");
        }
      } catch (loadError) {
        console.error(loadError);
        if (isMounted) {
          setError("Unable to load this snippet.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSnippet();

    return () => {
      isMounted = false;
    };
  }, [snippetId]);

  async function handleFavorite() {
    if (!snippetId) {
      return;
    }

    await toggleFavourate(snippetId);
    const nextSnippet = await getSnippetsById(snippetId);
    setSnippet(nextSnippet ?? null);
  }
  const openShare = () => {
    setShareExtension(defaultShareType.extension);
    setShareMimeType(defaultShareType.mimeType);
    setIsShareOpen(true);
  }

  const handleShare = async () =>{
    const extension = cleanExtension(shareExtension);
    const fileName = `${cleanFileName(displaySnippet.title)}.${extension}`;

    await shareFile(fileName, displaySnippet.code, shareMimeType.trim() || "text/plain");
    setIsShareOpen(false);
  }
  if (isLoading) {
    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors.background,
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.primary} />
        <Text
          style={{
            color: colors.onSurfaceVariant,
            fontFamily: "Inter",
            fontSize: 14,
            marginTop: 8,
          }}
        >
          Loading snippet
        </Text>
      </View>
    );
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
        <Pressable
          hitSlop={12}
          onPress={() => router.back()}
          style={{
            alignItems: "center",
            borderRadius: 8,
            height: 40,
            justifyContent: "center",
            width: 40,
          }}
        >
          <Icon color={colors.primary} name={icons.app} size={24} />
        </Pressable>

        <Text
          style={{
            color: colors.onSurface,
            fontFamily: "Inter",
            fontSize: 20,
            fontWeight: "700",
            lineHeight: 28,
          }}
        >
          DevFlow
        </Text>

        <View
          style={{
            alignItems: "center",
            borderRadius: 8,
            height: 40,
            justifyContent: "center",
            width: 40,
          }}
        >
          <Icon color={colors.onSurfaceVariant} name={icons.search} size={24} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 28,
          paddingHorizontal: 16,
          paddingTop: 24,
        }}
        style={{ backgroundColor: colors.background, flex: 1 }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            alignItems: "center",
            columnGap: 8,
            flexDirection: "row",
            marginBottom: 24,
          }}
        >
          <Icon color={colors.onSurfaceVariant} name={icons.back} size={18} />
          <Text
            style={{
              color: colors.onSurfaceVariant,
              fontFamily: "Inter",
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            Back to Snippets
          </Text>
        </Pressable>

        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              color: colors.onSurface,
              fontFamily: "Inter",
              fontSize: 28,
              fontWeight: "700",
              lineHeight: 34,
              marginBottom: 8,
            }}
          >
            {displaySnippet.title}
          </Text>

          <View
            style={{
              alignItems: "center",
              columnGap: 10,
              flexDirection: "row",
              flexWrap: "wrap",
              rowGap: 8,
            }}
          >
            <Text
              style={{
                color: colors.onSurfaceVariant,
                fontFamily: "Inter",
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              Updated {formatDate(displaySnippet.updatedAt)}
            </Text>
            <Text style={{ color: colors.outline }}>•</Text>
            <Tag color={colors.tertiary} label={displaySnippet.languageName ?? "Unknown"} />
            {tags.slice(0, 2).map((tag) => (
              <Tag color={colors.onSurfaceVariant} key={tag} label={tag} />
            ))}
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            alignSelf: "flex-start",
            backgroundColor: colors.surfaceContainerLow,
            borderColor: borderSubtle,
            borderRadius: 10,
            borderWidth: 1,
            columnGap: 8,
            flexDirection: "row",
            marginBottom: 16,
            padding: 4,
          }}
        >
          <ActionButton
            color={colors.onSurfaceVariant}
            icon={icons.edit}
            onPress={() => router.push(`/snippit/create/${snippetId ?? ""}`)}
          />
          <Divider color={withAlpha(colors.outlineVariant, 0.45)} />
          <ActionButton color={colors.onSurfaceVariant} icon={icons.share} onPress={openShare}/>
          <Divider color={withAlpha(colors.outlineVariant, 0.45)} />
          <ActionButton
            color={colors.primary}
            icon={icons.copy}
            label="Copy"
            onPress={handleFavorite}
            selected
          />
        </View>

        {error ? (
          <Text
            style={{
              color: colors.error,
              fontFamily: "Inter",
              fontSize: 14,
              lineHeight: 20,
              marginBottom: 12,
            }}
          >
            {error}
          </Text>
        ) : null}

        <View
          style={{
            backgroundColor: panelBackground,
            borderColor: borderSubtle,
            borderRadius: 12,
            borderWidth: 1,
            marginBottom: 24,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              alignItems: "center",
              backgroundColor: colors.surfaceContainerHigh,
              borderBottomColor: withAlpha(colors.outlineVariant, 0.3),
              borderBottomWidth: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <View style={{ alignItems: "center", columnGap: 8, flexDirection: "row" }}>
              <Icon color={colors.tertiary} name={icons.braces} size={16} />
              <Text
                style={{
                  color: colors.onSurfaceVariant,
                  fontFamily: "JetBrains Mono",
                  fontSize: 12,
                  lineHeight: 18,
                }}
              >
                {slugify(displaySnippet.title)}.{extensionFor(displaySnippet.languageName)}
              </Text>
            </View>
            <View style={{ columnGap: 6, flexDirection: "row" }}>
              {[0, 1, 2].map((dot) => (
                <View
                  key={dot}
                  style={{
                    backgroundColor: withAlpha(colors.outlineVariant, 0.72),
                    borderRadius: 999,
                    height: 10,
                    width: 10,
                  }}
                />
              ))}
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: "100%", padding: 16 }}>
              {lines.map((line, index) => (
                <Text
                  key={`${index}-${line}`}
                  selectable
                  style={{
                    color: colors.onSurfaceVariant,
                    fontFamily: "JetBrains Mono",
                    fontSize: 14,
                    lineHeight: 22,
                    paddingHorizontal: 4
                  }}
                >
                  {line || " "}
                </Text>
              ))}
            </View>
          </ScrollView>
        </View>

        <View
          style={{
            backgroundColor: withAlpha(colors.secondaryContainer, theme === "dark" ? 0.14 : 0.18),
            borderColor: withAlpha(colors.secondary, 0.34),
            borderRadius: 12,
            borderWidth: 1,
            marginBottom: 24,
            overflow: "hidden",
            padding: 16,
          }}
        >
          <View style={{ alignItems: "center", columnGap: 8, flexDirection: "row", marginBottom: 8 }}>
            <Icon color={colors.secondary} name={icons.sparkles} size={20} />
            <Text
              style={{
                color: colors.secondary,
                fontFamily: "Inter",
                fontSize: 20,
                fontWeight: "700",
                lineHeight: 28,
              }}
            >
              AI Explanation
            </Text>
          </View>

          <Text
            style={{
              color: colors.onSurfaceVariant,
              fontFamily: "Inter",
              fontSize: 16,
              lineHeight: 24,
              marginBottom: 12,
            }}
          >
            {aiResponse}
          </Text>
        </View>

        <View
          style={{
            borderTopColor: withAlpha(colors.outlineVariant, 0.24),
            borderTopWidth: 1,
            paddingTop: 16,
          }}
        >
          <View style={{ alignItems: "center", columnGap: 8, flexDirection: "row", marginBottom: 12 }}>
            <Icon color={colors.onSurfaceVariant} name={icons.folder} size={20} />
            <Text
              style={{
                color: colors.onSurface,
                fontFamily: "Inter",
                fontSize: 20,
                fontWeight: "700",
                lineHeight: 28,
              }}
            >
              Related Utilities
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ columnGap: 16, flexDirection: "row", paddingBottom: 4 }}>
              {(related.length ? related : []).map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(`/snippit/${item.id}`)}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: withAlpha(colors.outlineVariant, 0.42),
                    borderRadius: 8,
                    borderWidth: 1,
                    padding: 16,
                    width: 240,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      color: colors.tertiary,
                      fontFamily: "JetBrains Mono",
                      fontSize: 12,
                      lineHeight: 18,
                      marginBottom: 8,
                    }}
                  >
                    {slugify(item.title)}.{extensionFor(item.languageName)}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: colors.onSurface,
                      fontFamily: "Inter",
                      fontSize: 16,
                      fontWeight: "700",
                      lineHeight: 24,
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      color: colors.onSurfaceVariant,
                      fontFamily: "Inter",
                      fontSize: 14,
                      lineHeight: 20,
                    }}
                  >
                    {item.code}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={() => setIsShareOpen(false)}
        transparent
        visible={isShareOpen}
      >
        <View
          style={{
            alignItems: "center",
            backgroundColor: withAlpha(colors.background, 0.86),
            flex: 1,
            justifyContent: "center",
            padding: 16,
          }}
        >
          <Pressable
            onPress={() => setIsShareOpen(false)}
            style={{ bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }}
          />
          <View
            style={{
              backgroundColor: colors.surface,
              borderColor: borderSubtle,
              borderRadius: 16,
              borderWidth: 1,
              maxWidth: 440,
              padding: 20,
              width: "100%",
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  color: colors.onSurface,
                  fontFamily: "Inter",
                  fontSize: 22,
                  fontWeight: "800",
                }}
              >
                Share Snippet
              </Text>
              <Pressable hitSlop={12} onPress={() => setIsShareOpen(false)}>
                <Icon color={colors.onSurfaceVariant} name={icons.close} size={22} />
              </Pressable>
            </View>

            <Text
              style={{
                color: colors.onSurfaceVariant,
                fontFamily: "Inter",
                fontSize: 14,
                lineHeight: 20,
                marginBottom: 12,
              }}
            >
              Choose the file extension and MIME type before sharing.
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {DOWNLOAD_MIME_TYPES.map((item) => {
                const selected =
                  item.extension === cleanExtension(shareExtension) &&
                  item.mimeType === shareMimeType;

                return (
                  <Pressable
                    key={`${item.extension}-${item.mimeType}`}
                    onPress={() => {
                      setShareExtension(item.extension);
                      setShareMimeType(item.mimeType);
                    }}
                    style={{
                      backgroundColor: selected
                        ? withAlpha(colors.primary, 0.16)
                        : colors.surfaceContainerLow,
                      borderColor: selected ? colors.primary : borderSubtle,
                      borderRadius: 999,
                      borderWidth: 1,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: selected ? colors.primary : colors.onSurfaceVariant,
                        fontFamily: "Inter",
                        fontSize: 13,
                        fontWeight: "700",
                      }}
                    >
                      .{item.extension}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <ShareField
              borderColor={borderSubtle}
              colors={colors}
              label="Extension"
              onChangeText={setShareExtension}
              value={shareExtension}
            />
            <ShareField
              borderColor={borderSubtle}
              colors={colors}
              label="MIME Type"
              onChangeText={setShareMimeType}
              value={shareMimeType}
            />

            <Text
              style={{
                color: colors.outline,
                fontFamily: "JetBrains Mono",
                fontSize: 12,
                lineHeight: 18,
                marginTop: 4,
              }}
            >
              {cleanFileName(displaySnippet.title)}.{cleanExtension(shareExtension)}
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 12,
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <Pressable onPress={() => setIsShareOpen(false)} style={{ padding: 12 }}>
                <Text
                  style={{
                    color: colors.primary,
                    fontFamily: "Inter",
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleShare}
                style={{
                  alignItems: "center",
                  backgroundColor: colors.primaryContainer,
                  borderRadius: 10,
                  flexDirection: "row",
                  gap: 8,
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                }}
              >
                <Icon color={colors.onPrimaryContainer} name={icons.share} size={18} />
                <Text
                  style={{
                    color: colors.onPrimaryContainer,
                    fontFamily: "Inter",
                    fontSize: 15,
                    fontWeight: "800",
                  }}
                >
                  Share
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

  function Tag({ color, label }: { color: string; label: string }) {
    return (
      <View
        style={{
          backgroundColor: withAlpha(color, 0.1),
          borderColor: withAlpha(color, 0.36),
          borderRadius: 4,
          borderWidth: 1,
          paddingHorizontal: 8,
          paddingVertical: 3,
        }}
      >
        <Text
          style={{
            color,
            fontFamily: "JetBrains Mono",
            fontSize: 12,
            lineHeight: 18,
          }}
        >
          {label}
        </Text>
      </View>
    );
  }

  function ActionButton({
    color,
    icon,
    label,
    onPress,
    selected,
  }: {
    color: string;
    icon: IconName;
    label?: string;
    onPress?: () => void;
    selected?: boolean;
  }) {
    return (
      <Pressable
        onPress={onPress}
        style={{
          alignItems: "center",
          backgroundColor: selected ? withAlpha(colors.primary, 0.12) : "transparent",
          borderColor: selected ? withAlpha(colors.primary, 0.24) : "transparent",
          borderRadius: 8,
          borderWidth: 1,
          columnGap: 6,
          flexDirection: "row",
          minHeight: 40,
          paddingHorizontal: 10,
        }}
      >
        <Icon color={color} name={icon} size={20} />
        {label ? (
          <Text
            style={{
              color,
              fontFamily: "Inter",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 0.5,
              lineHeight: 16,
              textTransform: "uppercase",
            }}
          >
            {label}
          </Text>
        ) : null}
      </Pressable>
    );
  }

  function Divider({ color }: { color: string }) {
    return <View style={{ alignSelf: "center", backgroundColor: color, height: 18, width: 1 }} />;
  }

  function SmallButton({
    color,
    icon,
    label,
  }: {
    color: string;
    icon: IconName;
    label: string;
  }) {
    return (
      <View
        style={{
          alignItems: "center",
          borderColor: withAlpha(color, 0.3),
          borderRadius: 8,
          borderWidth: 1,
          columnGap: 6,
          flexDirection: "row",
          paddingHorizontal: 12,
          paddingVertical: 7,
        }}
      >
        <Icon color={color} name={icon} size={16} />
        <Text
          style={{
            color,
            fontFamily: "Inter",
            fontSize: 11,
            fontWeight: "700",
            lineHeight: 16,
          }}
        >
          {label}
        </Text>
      </View>
    );
  }
}

function ShareField({
  borderColor,
  colors,
  label,
  onChangeText,
  value,
}: {
  borderColor: string;
  colors: ReturnType<typeof useTheme>["colors"];
  label: string;
  onChangeText: (text: string) => void;
  value: string;
}) {
  return (
    <View style={{ gap: 8, marginBottom: 12 }}>
      <Text
        style={{
          color: colors.onSurfaceVariant,
          fontFamily: "Inter",
          fontSize: 11,
          fontWeight: "800",
          letterSpacing: 1.2,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
        value={value}
        style={{
          backgroundColor: colors.surfaceContainerLowest,
          borderColor,
          borderRadius: 10,
          borderWidth: 1,
          color: colors.onSurface,
          fontFamily: "JetBrains Mono",
          fontSize: 14,
          minHeight: 48,
          paddingHorizontal: 12,
        }}
      />
    </View>
  );
}

function cleanExtension(value: string) {
  return value.replace(/^\./, "").replace(/[^a-zA-Z0-9]/g, "").trim() || "txt";
}

function cleanFileName(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .replace(/^_+|_+$/g, "") || "snippet";
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24) || "snippet";
}

function extensionFor(language?: string) {
  const normalized = language?.toLowerCase();

  if (normalized === "typescript") {
    return "ts";
  }
  if (normalized === "rust") {
    return "rs";
  }
  if (normalized === "python") {
    return "py";
  }
  if (normalized === "go") {
    return "go";
  }

  return "txt";
}
