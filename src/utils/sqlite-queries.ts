import * as SQLite from "expo-sqlite";
let db: SQLite.SQLiteDatabase;
export const constants = {
  PROGRAMMING_LANGUAGE_TABLE_NAME: "programming_language",
  SNIPPIT_TABLE_NAME: "snippit",
};

export type ProgrammingLanguage = {
  id: number;
  name: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};

export type Snippit = {
  id: number;
  title: string;
  code: string;
  languageId: number;
  languageName?: string;
  languageIcon?: string;
  tags: string | null;
  isFavorite: number;
  createdAt: string;
  updatedAt: string;
};

type SnippitInput = {
  title: string;
  code: string;
  languageId: number;
  tags: string[];
};

async function getDatabase() {
  if (!db) {
    return await initDatabase();
  }

  return db;
}

export const initDatabase = async function initDatabase() {
  try {
    db = await SQLite.openDatabaseAsync("devflow.db");
  db.execSync(`
        CREATE TABLE IF NOT EXISTS ${constants.PROGRAMMING_LANGUAGE_TABLE_NAME} (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            icon TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
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
  await seedProgrammingLanguages();
  return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

async function seedProgrammingLanguages() {
  try {
    const existing = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM ${constants.PROGRAMMING_LANGUAGE_TABLE_NAME}`,
  );

  if (existing && existing.count > 0) {
    return;
  }

  const languages = [
    ["TypeScript", "TS"],
    ["Rust", "RS"],
    ["Python", "PY"],
    ["Go", "GO"],
  ];

  for (const [name, icon] of languages) {
    await db.runAsync(
      `INSERT INTO ${constants.PROGRAMMING_LANGUAGE_TABLE_NAME} (name, icon) VALUES (?, ?)`,
      name,
      icon,
    );
  }
  } catch (error) {
    console.error("Error seeding programming languages:", error);
    throw error;
  }
}

export const readData = async (
  tableName: string,
  query: string = "",
  project: string = "*",
) => {
  try {
    const database = await getDatabase();
    const result = await database.getAllAsync<ProgrammingLanguage>(
      `SELECT ${project} FROM ${tableName} ${query}`,
    );
    return result;
  } catch (error) {
    console.error("Error reading data:", error);
    throw error;
  }
};

export const deleteData = async (tableName: string, query: string = "") => {
  try {
    const database = await getDatabase();
    const result = await database.runAsync(`DELETE FROM ${tableName} ${query}`);
    return result;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

export const runQuery = async (query: string) => {
  try {
    const database = await getDatabase();
    const result = await database.runAsync(query);
    return result;
  } catch (error) {
    console.error("Error running query:", error);
    throw error;
  }
};

export const closeDatabase = async () => {
  try {
    const database = await getDatabase();
    await database.closeAsync();
  } catch (error) {
    console.error("Error closing database:", error);
  }
};

//queries
export async function getProgrammingLanguages() {
  try {
    const database = await getDatabase();
    return await database.getAllAsync<ProgrammingLanguage>(
      `SELECT * FROM ${constants.PROGRAMMING_LANGUAGE_TABLE_NAME} ORDER BY id ASC`,
    );
  } catch (error) {
    console.error("Error reading programming languages:", error);
    throw error;
  }
}
export async function getSnippets() {
  try {
    const database = await getDatabase();
    return await database.getAllAsync<Snippit>(
      `SELECT s.*, l.name as languageName, l.icon as languageIcon
             FROM ${constants.SNIPPIT_TABLE_NAME} s
             LEFT JOIN ${constants.PROGRAMMING_LANGUAGE_TABLE_NAME} l ON l.id = s.languageId
             ORDER BY s.updatedAt DESC`,
    );
  } catch (error) {
    console.error("Error reading snippets:", error);
    throw error;
  }
}
export async function getSnippetsById(snippetId: number) {
  try {
    const database = await getDatabase();
    return await database.getFirstAsync<Snippit>(
      `SELECT s.*, l.name as languageName, l.icon as languageIcon
             FROM ${constants.SNIPPIT_TABLE_NAME} s
             LEFT JOIN ${constants.PROGRAMMING_LANGUAGE_TABLE_NAME} l ON l.id = s.languageId
             WHERE s.id = ?`,
      snippetId,
    );
  } catch (error) {
    console.error("Error reading snippet by ID:", error);
    throw error;
  }
}
export async function insertProgrammingLanguages(name: string, icon: string) {
  try {
    const database = await getDatabase();
    return await database.runAsync(
      `INSERT INTO ${constants.PROGRAMMING_LANGUAGE_TABLE_NAME} (name, icon) VALUES (?, ?)`,
      name,
      icon,
    );
  } catch (error) {
    console.error("Error inserting programming language:", error);
    throw error;
  }
}
export async function insertSnippets(
  name: string,
  code: string,
  languageId: number,
  tags: string[] = [],
) {
  try {
    const database = await getDatabase();
    const tagStr = tags.join(",");
    return await database.runAsync(
      `INSERT INTO ${constants.SNIPPIT_TABLE_NAME} (title, code, languageId, tags) VALUES (?, ?, ?, ?)`,
      name,
      code,
      languageId,
      tagStr,
    );
  } catch (error) {
    console.error("Error inserting snippet:", error);
    throw error;
  }
}
export async function upsertSnippit(snippit: SnippitInput, snippetId?: number) {
  try {
    const database = await getDatabase();
    const tagStr = snippit.tags.join(",");

    if (snippetId) {
      await database.runAsync(
        `UPDATE ${constants.SNIPPIT_TABLE_NAME}
       SET title = ?, code = ?, languageId = ?, tags = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
        snippit.title,
        snippit.code,
        snippit.languageId,
        tagStr,
        snippetId,
      );

      return snippetId;
    }

    const result = await database.runAsync(
      `INSERT INTO ${constants.SNIPPIT_TABLE_NAME} (title, code, languageId, tags) VALUES (?, ?, ?, ?)`,
      snippit.title,
      snippit.code,
      snippit.languageId,
      tagStr,
    );

    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error upserting snippet:", error);
    throw error;
  }
}
export async function toggleFavourate(snippetId: number) {
  try {
    const database = await getDatabase();
    return await database.runAsync(
      `UPDATE ${constants.SNIPPIT_TABLE_NAME} SET isFavorite = NOT isFavorite WHERE id = ?`,
      snippetId,
    );
  } catch (error) {
    console.error("Error toggling favourite:", error);
    throw error;
  }
}
export async function getFavouratesSnippits() {
    try {
      const database = await getDatabase();
      return await database.getAllAsync<Snippit>(
        `SELECT s.*, l.name as languageName, l.icon as languageIcon
               FROM ${constants.SNIPPIT_TABLE_NAME} s
               LEFT JOIN ${constants.PROGRAMMING_LANGUAGE_TABLE_NAME} l ON l.id = s.languageId
               WHERE s.isFavorite = 1
               ORDER BY s.updatedAt DESC`,
      );
    } catch (error) {
      console.error("Error reading favourates:", error);
      throw error;
    }
}
