import db from "./db";

export const initializeDatabase = () => {
	db.execSync(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      isFavorite INTEGER
    );
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      categoryId TEXT NOT NULL,
      frequency TEXT NOT NULL,
      completedDates TEXT,
      isFavorite INTEGER,
      createdAt TEXT,
      FOREIGN KEY (categoryId) REFERENCES categories(id)
    );
  `);

	const existing = db.getAllSync("SELECT id FROM categories");
	if (existing.length === 0) {
		db.runSync(
			`INSERT INTO categories (id, name, icon, color, isFavorite) VALUES 
       (?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?)`,
			["1", "Health", "a.png", "#E57373", 1, "2", "Productivity", "a.png", "#64B5F6", 0]
		);
	}
};
