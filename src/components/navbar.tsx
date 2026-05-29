import { StatusBar, Text, View } from 'react-native'
import React from 'react'
import Toggle from './toggle'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/hooks/useTheme'

const Navbar = () => {
  const {theme} = useTheme()
  console.log({theme})
  return (
    <SafeAreaView>
      <StatusBar/>
      <View className='bg-background flex flex-row justify-between items-center p-4'>
        <Text className='text-foreground font-bold text-lg'>devflow</Text>
        <Toggle />
      </View>
    </SafeAreaView>
  )
}

export default Navbar