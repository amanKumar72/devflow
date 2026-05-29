import AsyncStorage from '@react-native-async-storage/async-storage'

export const setItemIntoAsyncStorage = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value))
}

export const getItemFromAsyncStorage = async (key: string) => {
  const value = await AsyncStorage.getItem(key)
  return value ? JSON.parse(value) : null
}

export const removeItemFromAsyncStorage = async (key: string) => {
  await AsyncStorage.removeItem(key)
}

export const clearAsyncStorage = async () => {
  await AsyncStorage.clear()
}

export const getAllKeysFromAsyncStorage = async () => {
  return await AsyncStorage.getAllKeys()
}

export const getMultipleItemsFromAsyncStorage = async (keys: string[]) => {
  return await AsyncStorage.multiGet(keys)
}

export const removeMultipleItemsFromAsyncStorage = async (keys: string[]) => {
  await AsyncStorage.multiRemove(keys)
}
