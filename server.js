const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const routes = require("./router/router.js");
const { getAllQuotes, AddQuotes } = require("./controllers/controller.js");

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
app.use("/get-quotes", getAllQuotes);

// Add a new quote
app.use("/add-quote", AddQuotes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
