import Navbar from "@/components/navbar";
import { useTheme } from "@/hooks/useTheme";
import { createAndGetFile } from "@/utils/file-system";
import { initDatabase, readData, runQuery } from "@/utils/sqlite-queries";
import { useEffect } from "react";
import { StatusBar, Text, View } from "react-native";


export default function Index() {
  const theme = useTheme();
  useEffect(() => {
    createAndGetFile('server.js', 'const a = 10; console.log(a);').then((content) => {
      if (content) {
        console.log(content)
      }
    })
  }, [])
  return (
     <View className="flex-1 bg-background">
      <Navbar />
      <StatusBar />
      <Text className="text-foreground">Hello</Text>
     </View>
  );
}
