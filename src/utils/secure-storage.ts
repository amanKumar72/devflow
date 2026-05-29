import * as SecureStore from 'expo-secure-store'

export const setItemIntoSecureStorage = async (key: string, value: any, options: SecureStore.SecureStoreOptions = {}) => {
  await SecureStore.setItemAsync(key, JSON.stringify(value), options)
}

export const getItemFromSecureStorage = async (key: string, options: SecureStore.SecureStoreOptions = {}) => {
  const value = await SecureStore.getItemAsync(key, options)
  return value ? JSON.parse(value) : null
}

export const removeItemFromSecureStorage = async (key: string, options: SecureStore.SecureStoreOptions = {}) => {
  await SecureStore.deleteItemAsync(key, options)
}

export const isSecureStorageAvailable = async () => {
  return await SecureStore.isAvailableAsync() === true
}
