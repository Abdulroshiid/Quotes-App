const { sql } = require("../db.js");

const getAllQuotes = async (req, res) => {
  try {
    const { rows } = await sql`SELECT * FROM quotes ORDER BY created_at DESC`;
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const AddQuotes = async (req, res) => {
  const { text, author } = req.body;
  if (!text) return res.status(400).json({ error: "Quote text is required" });

  try {
    const { rows } =
      await sql`INSERT INTO quotes (text, author) VALUES (${text}, ${author || "Anonymous"}) RETURNING id, text, author`;
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllQuotes, AddQuotes };
