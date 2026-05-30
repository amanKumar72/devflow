import * as Clipboard from "expo-clipboard";
import { Platform } from "react-native";

export async function copyTextToClipboard(text: string) {
  if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  await Clipboard.setStringAsync(text);
  return true;
}
