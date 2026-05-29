import Navbar from "@/components/navbar";
import { useTheme } from "@/hooks/useTheme";
import { initDatabase, readData, runQuery } from "@/utils/sqlite-queries";
import { useEffect } from "react";
import { StatusBar, Text, View } from "react-native";


async function fetchData() {
  const res= await readData('programming_language')
  console.log("programming_language", res)
}
async function initializeDB() {
  await initDatabase()
}
async function insertData() {
  await runQuery(`INSERT INTO programming_language (name, icon) VALUES ('JavaScript', 'js.png')`)
}
export default function Index() {
  const theme = useTheme();
  useEffect(() => {
    initializeDB().then(() => {
      fetchData()
      fetchData()
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
