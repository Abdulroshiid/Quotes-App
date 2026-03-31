const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// 1. Database Connection
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error("Database opening error: ", err);
  console.log("Connected to SQLite database.");
});

// 2. Middleware
app.use(express.json()); // Allows server to read JSON sent from frontend
app.use(express.static("public")); // Serves your HTML/CSS/JS files

// 3. Initialize Table
db.run(`CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    author TEXT DEFAULT 'Anonymous',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// 4. Routes
// Fetch all quotes
app.get("/get-quotes", (req, res) => {
  db.all("SELECT * FROM quotes ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add a new quote
app.post("/add-quote", (req, res) => {
  const { text, author } = req.body;
  if (!text) return res.status(400).json({ error: "Quote text is required" });

  const query = `INSERT INTO quotes (text, author) VALUES (?, ?)`;
  db.run(query, [text, author || "Anonymous"], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, text, author });
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
