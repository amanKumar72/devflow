import { useTheme } from "@/hooks/useTheme";
import {
  getProgrammingLanguages,
  getSnippetsById,
  initDatabase,
  type ProgrammingLanguage,
  readData,
  upsertSnippit,
} from "@/utils/sqlite-queries";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { parseTags, icons, withAlpha, Icon, normalizeParam } from "@/utils/common";
import { getItemFromAsyncStorage } from "@/utils/async-storage";



export default function CreateSnippit() {
  const { colors, theme } = useTheme();
  const [fontSize, setFontSize] = useState<number>(14);
  const params = useLocalSearchParams();
  const snippetId = normalizeParam(params.id);

  const [title, setTitle] = useState("");
  const [code, setCode] = useState('');
  const [selectedLanguageId, setSelectedLanguageId] = useState(1);
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const lineCount = useMemo(() => Math.max(12, code.split("\n").length), [code]);
  
  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, index) => index + 1),
    [lineCount]
  );

  const borderSubtle = withAlpha(colors.outlineVariant, theme === "dark" ? 0.34 : 0.65);
  const editorBackground =
    theme === "dark" ? colors.surfaceContainerLowest : colors.surfaceContainerLow;
  const headerBackground =
    theme === "dark" ? withAlpha(colors.surface, 0.82) : withAlpha(colors.surface, 0.92);
  const panelBackground =
    theme === "dark" ? colors.surfaceContainerLow : colors.surfaceContainerLowest;
  const visibleLanguages =
    languages.length > 0
      ? languages
      : [
          {
            id: 1,
            name: "TypeScript",
            icon: "TS",
            createdAt: "",
            updatedAt: "",
          },
        ];

  useEffect(() => {
    let isMounted = true;

    async function loadScreenData() {
      try {
        await initDatabase();
        const nextLanguages = await getProgrammingLanguages();
        if (!isMounted) {
          return;
        }

        setLanguages(nextLanguages);
        setSelectedLanguageId(nextLanguages[0]?.id ?? 1);
        setFontSize(Number(await getItemFromAsyncStorage("fontSize") ?? "14"));

        if (!snippetId) {
          setTitle("");
          setCode('');
          setTags([]);
          return;
        }

        const snippet = await getSnippetsById(snippetId);

        if (!snippet || !isMounted) {
          setTitle("");
          setCode('');
          setTags([]);
          return;
        }

        setTitle(snippet.title);
        setCode(snippet.code);
        setTags(parseTags(snippet.tags));
        setSelectedLanguageId(snippet.languageId);
      } catch (loadError) {
        console.error(loadError);
        if (isMounted) {
          setError("Unable to load snippet data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsDirty(false);
        }
      }
    }

    try {
      loadScreenData();
    } catch (error) {
      
    }

    return () => {
      isMounted = false;
    };
  }, [snippetId]);

  function markDirty() {
    if (!isDirty) {
      setIsDirty(true);
    }
  }

  function addTag() {
    const nextTag = tagDraft.trim();

    if (!nextTag || tags.includes(nextTag)) {
      setTagDraft("");
      return;
    }
    const newTags = [...tags, nextTag];
    setTags(newTags);
    setTagDraft("");
    markDirty();
  }

  function removeTag(tagToRemove: string) {
    setTags((currentTags) => currentTags.filter((tag) => tag !== tagToRemove));
    markDirty();
  }

  async function handleSave() {
    const cleanTitle = title.trim();
    const cleanCode = code.trimEnd();

    if (!cleanTitle) {
      setError("Add a snippet title before saving.");
      return;
    }

    if (!cleanCode) {
      setError("Add code before saving.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const savedId = await upsertSnippit(
        {
          title: cleanTitle,
          code: cleanCode,
          languageId: selectedLanguageId,
          tags,
        },
        snippetId
      );

      setIsDirty(false);
      router.replace(`/snippit/${savedId}`);
    } catch (saveError) {
      console.error(saveError);
      setError("Unable to save this snippet.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView
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
            lineHeight: 20,
            marginTop: 8,
          }}
        >
          Loading editor
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View
          style={{
            alignItems: "center",
            backgroundColor: headerBackground,
            borderBottomColor: borderSubtle,
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
              columnGap: 4,
              flexDirection: "row",
              height: 44,
              minWidth: 96,
            }}
          >
            <Icon color={colors.onSurfaceVariant} name={icons.close} size={20} />
            <Text
              style={{
                color: colors.onSurfaceVariant,
                fontFamily: "Inter",
                fontSize: 16,
                lineHeight: 24,
              }}
            >
              Cancel
            </Text>
          </Pressable>

          <Text
            style={{
              color: colors.onSurface,
              fontFamily: "Inter",
              fontSize: 20,
              fontWeight: "600",
              left: 120,
              lineHeight: 28,
              position: "absolute",
              right: 120,
              textAlign: "center",
            }}
          >
            {snippetId ? "Edit Snippet" : "New Snippet"}
          </Text>

          <Pressable
            disabled={isSaving}
            onPress={handleSave}
            style={{
              alignItems: "center",
              backgroundColor: withAlpha(colors.primary, theme === "dark" ? 0.12 : 0.16),
              borderRadius: 999,
              columnGap: 8,
              flexDirection: "row",
              height: 44,
              opacity: isSaving ? 0.64 : 1,
              paddingHorizontal: 16,
            }}
          >
            <Icon color={colors.primary} name={icons.save} size={18} />
            <Text
              style={{
                color: colors.primary,
                fontFamily: "Inter",
                fontSize: 16,
                fontWeight: "600",
                lineHeight: 24,
              }}
            >
              {isSaving ? "Saving" : "Save"}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{
            backgroundColor: colors.background,
            flexGrow: 1,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          style={{ backgroundColor: colors.background, flex: 1 }}
        >
          <View style={{ paddingHorizontal: 16, paddingBottom: 8, paddingTop: 24 }}>
            <TextInput
              onChangeText={(nextTitle) => {
                setTitle(nextTitle);
                markDirty();
              }}
              placeholder="Snippet Title..."
              placeholderTextColor={withAlpha(colors.onSurfaceVariant, 0.52)}
              style={{
                color: colors.onSurface,
                fontFamily: "Inter",
                fontSize: 32,
                fontWeight: "700",
                minHeight: 56,
                padding: 0,
              }}
              value={title}
            />
          </View>

          <ScrollView
            contentContainerStyle={{
              columnGap: 8,
              paddingBottom: 8,
              paddingHorizontal: 16,
              paddingTop: 8,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              borderBottomColor: withAlpha(colors.outlineVariant, 0.18),
              borderBottomWidth: 1,
              flexGrow: 0,
            }}
          >
            {visibleLanguages.map((language) => {
              const isSelected = language.id === selectedLanguageId;

              return (
                <Pressable
                  key={language.id}
                  onPress={() => {
                    setSelectedLanguageId(language.id);
                    markDirty();
                  }}
                  style={{
                    backgroundColor: isSelected
                      ? withAlpha(colors.primaryContainer, theme === "dark" ? 0.2 : 1)
                      : colors.surfaceContainer,
                    borderColor: isSelected ? withAlpha(colors.primary, 0.42) : borderSubtle,
                    borderRadius: 8,
                    borderWidth: 1,
                    columnGap: 8,
                    flexDirection: "row",
                    height: 40,
                    alignItems: "center",
                    paddingHorizontal: 12,
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? colors.primary : colors.onSurfaceVariant,
                      fontFamily: "Inter",
                      fontSize: 11,
                      fontWeight: "700",
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                    }}
                  >
                    {language.icon}
                  </Text>
                  <Text
                    style={{
                      color: isSelected ? colors.primary : colors.onSurfaceVariant,
                      fontFamily: "Inter",
                      fontSize: 11,
                      fontWeight: "700",
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                    }}
                  >
                    {language.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View
            style={{
              alignItems: "center",
              borderBottomColor: withAlpha(colors.outlineVariant, 0.18),
              borderBottomWidth: 1,
              columnGap: 8,
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: 16,
              paddingVertical: 16,
              rowGap: 8,
            }}
          >
            <Icon color={colors.onSurfaceVariant} name={icons.tag} size={20} />

            {tags.map((tag) => (
              <View
                key={tag}
                style={{
                  alignItems: "center",
                  backgroundColor: withAlpha(colors.secondary, 0.12),
                  borderColor: withAlpha(colors.secondary, 0.42),
                  borderRadius: 999,
                  borderWidth: 1,
                  columnGap: 4,
                  flexDirection: "row",
                  paddingBottom: 4,
                  paddingLeft: 8,
                  paddingRight: 12,
                  paddingTop: 4,
                }}
              >
                <Icon color={colors.secondary} name={icons.sparkles} size={14} />
                <Text
                  style={{
                    color: colors.secondary,
                    fontFamily: "JetBrains Mono",
                    fontSize: 12,
                    lineHeight: 18,
                  }}
                >
                  {tag}
                </Text>
                <Pressable hitSlop={8} onPress={() => removeTag(tag)}>
                  <Icon color={colors.outline} name={icons.close} size={14} />
                </Pressable>
              </View>
            ))}

            <TextInput
              onBlur={addTag}
              onChangeText={setTagDraft}
              onSubmitEditing={addTag}
              placeholder="Add tag..."
              placeholderTextColor={withAlpha(colors.onSurfaceVariant, 0.52)}
              returnKeyType="done"
              style={{
                color: colors.onSurface,
                flex: 1,
                fontFamily: "Inter",
                fontSize: 14,
                minHeight: 32,
                minWidth: 96,
                padding: 0,
              }}
              value={tagDraft}
            />
          </View>

          {error ? (
            <Text
              style={{
                color: colors.error,
                fontFamily: "Inter",
                fontSize: 14,
                lineHeight: 20,
                paddingHorizontal: 16,
                paddingTop: 8,
              }}
            >
              {error}
            </Text>
          ) : null}

          <View
            style={{
              backgroundColor: editorBackground,
              borderColor: borderSubtle,
              borderRadius: 12,
              borderWidth: 1,
              margin: 16,
              minHeight: 600,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                alignItems: "center",
                backgroundColor: colors.surfaceContainerHigh,
                borderBottomColor: borderSubtle,
                borderBottomWidth: 1,
                flexDirection: "row",
                height: 40,
                justifyContent: "space-between",
                paddingHorizontal: 12,
              }}
            >
              <View style={{ columnGap: 12, flexDirection: "row" }}>
                <Icon color={colors.onSurfaceVariant} name={icons.align} size={18} />
                <Icon color={colors.onSurfaceVariant} name={icons.braces} size={18} />
              </View>

              <View style={{ alignItems: "center", columnGap: 8, flexDirection: "row" }}>
                <View
                  style={{
                    backgroundColor: isDirty ? colors.secondary : colors.tertiary,
                    borderRadius: 999,
                    height: 8,
                    width: 8,
                  }}
                />
                <Text
                  style={{
                    color: colors.outline,
                    fontFamily: "JetBrains Mono",
                    fontSize: 12,
                  }}
                >
                  {isDirty ? "Unsaved" : "Saved"}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  backgroundColor: panelBackground,
                  borderRightColor: withAlpha(colors.outlineVariant, 0.2),
                  borderRightWidth: 1,
                  paddingRight: 12,
                  paddingVertical: 12,
                  width: 48,
                }}
              >
                {lineNumbers.map((lineNumber) => (
                  <Text
                    key={lineNumber}
                    style={{
                      color: withAlpha(colors.outline, 0.55),
                      fontFamily: "JetBrains Mono",
                      fontSize: 14,
                      lineHeight: 22,
                      textAlign: "right",
                    }}
                  >
                    {lineNumber}
                  </Text>
                ))}
              </View>

              <TextInput
                multiline
                onChangeText={(nextCode) => {
                  setCode(nextCode);
                  markDirty();
                }}
                placeholder="// Write your snippet here..."
                placeholderTextColor={withAlpha(colors.outline, 0.56)}
                scrollEnabled={false}
                spellCheck={false}
                style={{
                  color: colors.onSurface,
                  flex: 1,
                  fontFamily: "JetBrains Mono",
                  fontSize: fontSize,
                  lineHeight: 22,
                  minHeight: 520,
                  padding: 12,
                  textAlignVertical: "top",
                }}
                value={code}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
