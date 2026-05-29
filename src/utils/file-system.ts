import {File, Paths, Directory} from 'expo-file-system'
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
        return file.textSync()
    } catch (error) {
        console.error(error)
        throw Error('Failed to create file')
    }
}

