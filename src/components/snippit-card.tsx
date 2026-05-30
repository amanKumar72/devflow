import { useTheme } from "@/hooks/useTheme";
import { Snippit } from "@/utils/sqlite-queries";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Modal, Pressable, View, Text, TextInput } from "react-native";
import {
  languageColor,
  parseTags,
  withAlpha,
  Icon,
  icons,
} from "@/utils/common";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Chip from "./chip";
import { saveFile } from "@/utils/file-system";
import { DOWNLOAD_MIME_TYPES } from "@/utils/constants";

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
  const defaultDownloadType = useMemo(() => {
    const language = snippet.languageName?.toLowerCase();

    return (
      DOWNLOAD_MIME_TYPES.find((item) => item.label.toLowerCase() === language) ??
      DOWNLOAD_MIME_TYPES[0]
    );
  }, [snippet.languageName]);
  const [downloadExtension, setDownloadExtension] = useState<string>(defaultDownloadType.extension);
  const [downloadMimeType, setDownloadMimeType] = useState<string>(defaultDownloadType.mimeType);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const handleDownload = async () => {
    const extension = cleanExtension(downloadExtension);
    const fileName = `${cleanFileName(snippet.title)}.${extension}`;

    await saveFile(fileName, snippet.code, downloadMimeType.trim() || "text/plain");
    setIsDownloadOpen(false);
  };
  return (
    <>
      <Pressable
        key={snippet.id}
        onPress={() => router.push(`/snippit/${snippet.id}`)}
        style={{
          backgroundColor: colors.surface,
          borderColor: borderColor,
          borderRadius: 12,
          borderWidth: 1,
          gap: 16,
          padding: 22,
          marginBottom: 16,
        }}
      >
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: 14,
            flex: 1,
          }}
        >
          <View
            style={{
              alignItems: "center",
              backgroundColor: withAlpha(
                languageColor(snippet.languageName, colors),
                0.12,
              ),
              borderColor: withAlpha(
                languageColor(snippet.languageName, colors),
                0.28,
              ),
              borderRadius: 8,
              borderWidth: 1,
              height: 44,
              justifyContent: "center",
              width: 44,
            }}
          >
            <Text
              style={{
                color: languageColor(snippet.languageName, colors),
                fontFamily: "JetBrains Mono",
                fontWeight: "700",
              }}
            >
              {snippet.languageIcon ?? "{}"}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={{
              color: colors.onSurface,
              flex: 1,
              fontFamily: "Inter",
              fontSize: 22,
              fontWeight: "800",
            }}
          >
            {snippet.title}
          </Text>
        </View>
        <Pressable
          hitSlop={12}
          onPress={(event) => {
            event.stopPropagation();
            setDownloadExtension(defaultDownloadType.extension);
            setDownloadMimeType(defaultDownloadType.mimeType);
            setIsDownloadOpen(true);
          }}
          style={{marginRight:5}}
        >
            <MaterialIcons
              name="download"
              size={24}
              color={withAlpha(colors.outline, 0.52)}
            />
        </Pressable>
        <Pressable
          hitSlop={12}
          onPress={(event) => {
            event.stopPropagation();
            onFavorite(snippet.id);
          }}
        >
          {isFavorite ? (
            <MaterialIcons name="favorite" size={24} color={colors.primary} />
          ) : (
            <MaterialIcons
              name="favorite-outline"
              size={24}
              color={withAlpha(colors.outline, 0.52)}
            />
          )}
        </Pressable>
      </View>

      <View
        style={{
          backgroundColor:
            theme === "dark"
              ? colors.surfaceContainerLowest
              : colors.surfaceContainerLow,
          borderColor: borderColor,
          borderRadius: 8,
          borderWidth: 1,
          padding: 14,
        }}
      >
        <Text
          numberOfLines={3}
          style={{
            color: colors.onSurfaceVariant,
            fontFamily: "JetBrains Mono",
            fontSize: 12,
            lineHeight: 18,
          }}
        >
          {snippet.code}
        </Text>
      </View>

      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          {parseTags(snippet.tags)
            .slice(0, 2)
            .map((tag) => (
              <Chip key={tag} colors={colors} label={tag} />
            ))}
        </View>
        <View style={{ alignItems: "center", flexDirection: "row", gap: 4 }}>
          <Icon color={colors.outline} name={icons.notes} size={14} />
          <Text
            style={{
              color: colors.outline,
              fontFamily: "JetBrains Mono",
              fontSize: 12,
            }}
          >
            {snippet.code.split("\n").length}
          </Text>
        </View>
      </View>
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => setIsDownloadOpen(false)}
        transparent
        visible={isDownloadOpen}
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
            onPress={() => setIsDownloadOpen(false)}
            style={{ bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }}
          />
          <View
            style={{
              backgroundColor: colors.surface,
              borderColor,
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
                Download Snippet
              </Text>
              <Pressable hitSlop={12} onPress={() => setIsDownloadOpen(false)}>
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
              Choose the file extension and MIME type before saving.
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {DOWNLOAD_MIME_TYPES.map((item) => {
                const selected =
                  item.extension === cleanExtension(downloadExtension) &&
                  item.mimeType === downloadMimeType;

                return (
                  <Pressable
                    key={`${item.extension}-${item.mimeType}`}
                    onPress={() => {
                      setDownloadExtension(item.extension);
                      setDownloadMimeType(item.mimeType);
                    }}
                    style={{
                      backgroundColor: selected
                        ? withAlpha(colors.primary, 0.16)
                        : colors.surfaceContainerLow,
                      borderColor: selected ? colors.primary : borderColor,
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

            <Field
              borderColor={borderColor}
              colors={colors}
              label="Extension"
              onChangeText={setDownloadExtension}
              value={downloadExtension}
            />
            <Field
              borderColor={borderColor}
              colors={colors}
              label="MIME Type"
              onChangeText={setDownloadMimeType}
              value={downloadMimeType}
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
              {cleanFileName(snippet.title)}.{cleanExtension(downloadExtension)}
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 12,
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <Pressable onPress={() => setIsDownloadOpen(false)} style={{ padding: 12 }}>
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
                onPress={handleDownload}
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
                <MaterialIcons name="download" size={18} color={colors.onPrimaryContainer} />
                <Text
                  style={{
                    color: colors.onPrimaryContainer,
                    fontFamily: "Inter",
                    fontSize: 15,
                    fontWeight: "800",
                  }}
                >
                  Download
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function Field({
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
        onChangeText={onChangeText}
        value={value}
        autoCapitalize="none"
        autoCorrect={false}
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
