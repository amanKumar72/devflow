import * as SQLite from 'expo-sqlite'
let db: SQLite.SQLiteDatabase;
export const constants = {
    PROGRAMMING_LANGUAGE_TABLE_NAME: 'programming_language',
    SNIPPIT_TABLE_NAME: 'snippit',
}

export const initDatabase = async function initDatabase() {
    db = await SQLite.openDatabaseAsync('snippy.db')
    db.execSync(`
        CREATE TABLE IF NOT EXISTS ${constants.PROGRAMMING_LANGUAGE_TABLE_NAME} (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            icon TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `)
    db.execSync(`
        CREATE TABLE IF NOT EXISTS ${constants.SNIPPIT_TABLE_NAME} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            code TEXT NOT NULL,
            languageId INTEGER NOT NULL,
            tags TEXT,
            isFavorite INTEGER DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (languageId) REFERENCES programming_language(id)
        );
    `);
    return db;
}

export const readData = async (tableName: string, query: string = '',  project: string = '*') => {
    const result = await db.getAllAsync(`SELECT ${project} FROM ${tableName} ${query}`)
    return result;
}

export const deleteData = async (tableName: string, query: string = '') => {
    const result = await db.runAsync(`DELETE FROM ${tableName} ${query}`)
    return result;
}

export const runQuery = async (query: string) => {
    const result = await db.runAsync(query)
    return result;
}

export const closeDatabase = async () => {
  await db.closeAsync()
}