const { sql } = require("@vercel/postgres");

// Initialize table (run once or via migration)
async function initTable() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS quotes (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      author TEXT DEFAULT 'Anonymous',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("Table initialized successfully");
  } catch (err) {
    console.error("Error initializing table:", err);
  }
}

module.exports = { sql, initTable };
