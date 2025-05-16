import * as SQLite from "expo-sqlite";

// Open (or create) the database
const db = SQLite.openDatabaseSync("habitmo.db");

export default db;
