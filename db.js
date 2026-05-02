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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

module.exports = db;
