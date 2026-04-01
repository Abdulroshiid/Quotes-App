const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

//  Connect Database
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error("Database opening error: ", err);
  console.log("Connected to SQLite database.");
});

// Middleware
app.use(express.json()); // Allows server to read JSON sent from frontend
app.use(express.static("public")); // Serves your HTML/CSS/JS files

// Initialize SQLite Table
db.run(`CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    author TEXT DEFAULT 'Anonymous',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Routes
// Fetch all quotes in JSON format
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
  console.log(`Server is running on port ${PORT}...`);
});
