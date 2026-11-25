const path = require("path");
const SQLite = require("sqlite3").verbose();

// Database file path - absolute path to ensure consistency across devices
const dbPath = path.resolve(__dirname, "database.db");

//  Connect Database
const db = new SQLite.Database(dbPath, (err) => {
  if (err) console.error("Database opening error: ", err);
  console.log(`SQLite database is connected and running successfully!`);
});

// Initialize SQLite Table
db.run(`CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    author TEXT DEFAULT 'Anonymous',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER NOT NULL DEFAULT 0,
    favorite INTEGER NOT NULL DEFAULT 0
)`);

// Add columns for databases created by earlier versions of the app.
db.run(
  "ALTER TABLE quotes ADD COLUMN likes INTEGER NOT NULL DEFAULT 0",
  (err) => {
    if (err && !err.message.includes("duplicate column name"))
      console.error(err);
  },
);

db.run(
  "ALTER TABLE quotes ADD COLUMN favorite INTEGER NOT NOT NULL DEFAULT 0",
  (err) => {
    if (err && !err.message.includes("duplicate column name"))
      console.error(err);
  },
);

db.run(
  "ALTER TABLE quotes ADD COLUMN liked INTEGER NOT NULL DEFAULT 0",
  (err) => {
    if (err && !err.message.includes("duplicate column name"))
      console.error(err);
  },
);

module.exports = db;
