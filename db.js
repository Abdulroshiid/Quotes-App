const sqlite3 = require("sqlite3").verbose();

//  Connect Database
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error("Database opening error: ", err);
  console.log("Connected to SQLite database.");
});

// Initialize SQLite Table
db.run(`CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    author TEXT DEFAULT 'Anonymous',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

module.exports = db;
