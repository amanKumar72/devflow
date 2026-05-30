import { useTheme } from "@/hooks/useTheme";
import { SymbolView, type SymbolViewProps } from "expo-symbols";

export function parseTags(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function formatDate(value?: string | null) {
  if (!value) {
    return "Just now";
  }

  const date = new Date(value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function parseCodePreview(code: string) {
  return code
    .split("\n")
    .slice(0, 4)
    .join("\n")
    .trim();
}


export function languageColor(language: string | undefined, colors: ReturnType<typeof useTheme>["colors"]) {
  if (language?.toLowerCase() === "rust") return "#dea584";
  if (language?.toLowerCase() === "python") return colors.tertiary;
  if (language?.toLowerCase() === "go") return "#00add8";
  return colors.primary;
}

export type IconName = SymbolViewProps["name"];

export const icons = {
  app: { ios: "terminal", android: "terminal", web: "terminal" },
  back: { ios: "arrow.left", android: "arrow_back", web: "arrow_back" },
  braces: { ios: "curlybraces", android: "data_object", web: "data_object" },
  chat: { ios: "bubble.left", android: "chat_bubble", web: "chat_bubble" },
  copy: { ios: "doc.on.doc", android: "content_copy", web: "content_copy" },
  edit: { ios: "pencil", android: "edit", web: "edit" },
  folder: { ios: "folder", android: "folder_open", web: "folder_open" },
  search: { ios: "magnifyingglass", android: "search", web: "search" },
  share: { ios: "square.and.arrow.up", android: "share", web: "share" },
  sparkles: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  thumb: { ios: "hand.thumbsup", android: "thumb_up", web: "thumb_up" },
  close: { ios: "xmark", android: "close", web: "close" },
  save: { ios: "square.and.arrow.down", android: "save", web: "save" },
  tag: { ios: "tag", android: "sell", web: "sell" },
  align: { ios: "text.alignleft", android: "format_align_left", web: "format_align_left" },
  add: { ios: "plus", android: "add", web: "add" },
  bolt: { ios: "bolt", android: "bolt", web: "bolt" },
  database: { ios: "server.rack", android: "database", web: "database" },
  favorite: { ios: "heart", android: "favorite", web: "favorite" },
  favoriteFilled: { ios: "heart.fill", android: "favorite", web: "favorite" },
  notes: { ios: "text.alignleft", android: "notes", web: "notes" },
} satisfies Record<string, IconName>;

export function Icon({
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

export function normalizeParam(value: string | string[] | undefined) {
  const idParam = Array.isArray(value) ? value[0] : value;
  return  idParam && /^\d+$/.test(idParam) ? Number(idParam) : undefined;
}

export function withAlpha(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}