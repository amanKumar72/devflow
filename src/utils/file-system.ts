import {File, Paths, Directory} from 'expo-file-system'
import {StorageAccessFramework} from 'expo-file-system/legacy'
import * as Sharing from "expo-sharing";
export const SNIPPIT_DIRECTORY_NAME = 'snippit'
export type DirectoryType = 'document' | 'cache' ;

export const createAndGetDirectory = async (url: string, directory: DirectoryType = 'document') => {
    try {
        const path = directory === 'document' ? Paths.document : Paths.cache
        const dir = new Directory(path, url)
        if (!dir.exists) {
            dir.create()
        }
        return dir
    } catch (error) {
        console.error(error)
        throw Error('Failed to create directory')
    }
}

export const createAndGetFile = async (fileName: string, content: string, mimeType: string = 'text/plain', directory: DirectoryType = 'document') => {
    try {
        const path = directory === 'document' ? Paths.document : Paths.cache
        const file = new File(path,SNIPPIT_DIRECTORY_NAME, fileName)
        file.create({
            overwrite: true
        });
        file.write(content)
        return file
    } catch (error) {
        console.error(error)
        throw Error('Failed to create file')
    }
}
export const saveFile = async (fileName: string, content: string, mimeType: string = 'text/plain') => {
    try {
    // Ask user to pick a directory
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (permissions.granted) {
      const uri = permissions.directoryUri;

      // Create a new .txt file in the chosen directory
      const fileUri = await StorageAccessFramework.createFileAsync(
        uri,
        fileName,
        mimeType
      );

      // Write content to it
      await StorageAccessFramework.writeAsStringAsync(fileUri, content);
    }
    } catch (error) {
      console.error(error);
    }
  };
  
export const shareFile = async (fileName: string, content: string, mimeType: string = 'text/plain')=>{
    try {
        const file = await createAndGetFile(fileName, content, mimeType)
        if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
      }
    } catch (error) {
        
    }
}