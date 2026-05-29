import { Pressable, Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";

function ThemeToggle() {
  const { toggleTheme, theme } = useTheme();

  return (
     <Pressable hitSlop={30} onPress={toggleTheme}>
      <Text className="text-foreground" selectable={false}>
        {theme === 'dark' ? (
          <FontAwesome5 name="moon" size={22} />
        ) : (
          <AntDesign name="sun" size={22} />
        )}
      </Text>
    </Pressable>
  );
}

export default ThemeToggle;