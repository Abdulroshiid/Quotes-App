const db = require("../db.js");

const getAllQuotes = (req, res) => {
  const { search = "", filter = "all" } = req.query;
  const searchTerm = `%${search.trim()}%`;

  let query = "SELECT * FROM quotes WHERE (text LIKE ? OR author LIKE ?)";
  const params = [searchTerm, searchTerm];

  if (filter === "favorites") {
    query += " AND favorite = 1";
  } else if (filter === "popular") {
    query += " AND likes > 0";
  }

  query += filter === "popular"
    ? " ORDER BY likes DESC, created_at DESC"
    : " ORDER BY created_at DESC";

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const addQuote = (req, res) => {
  const text = req.body.text?.trim();
  const author = req.body.author?.trim() || "Anonymous";
  if (!text) return res.status(400).json({ error: "Quote text is required" });

  db.run(
    "INSERT INTO quotes (text, author) VALUES (?, ?)",
    [text, author],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, text, author, likes: 0, favorite: 0 });
    },
  );
};

const updateQuote = (req, res) => {
  const text = req.body.text?.trim();
  const author = req.body.author?.trim() || "Anonymous";
  if (!text) return res.status(400).json({ error: "Quote text is required" });

  db.run(
    "UPDATE quotes SET text = ?, author = ? WHERE id = ?",
    [text, author, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (!this.changes) return res.status(404).json({ error: "Quote not found" });
      res.json({ id: Number(req.params.id), text, author });
    },
  );
};

const deleteQuote = (req, res) => {
  db.run("DELETE FROM quotes WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (!this.changes) return res.status(404).json({ error: "Quote not found" });
    res.status(204).send();
  });
};

const toggleLike = (req, res) => {
  const { action = "increment" } = req.body;
  const sql = action === "decrement"
    ? "UPDATE quotes SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END WHERE id = ?"
    : "UPDATE quotes SET likes = likes + 1 WHERE id = ?";

  db.run(sql, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (!this.changes) return res.status(404).json({ error: "Quote not found" });
    db.get("SELECT likes FROM quotes WHERE id = ?", [req.params.id], (getErr, row) => {
      if (getErr) return res.status(500).json({ error: getErr.message });
      res.json(row);
    });
  });
};

const toggleFavorite = (req, res) => {
  db.run("UPDATE quotes SET favorite = CASE WHEN favorite = 1 THEN 0 ELSE 1 END WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (!this.changes) return res.status(404).json({ error: "Quote not found" });
    db.get("SELECT favorite FROM quotes WHERE id = ?", [req.params.id], (getErr, row) => {
      if (getErr) return res.status(500).json({ error: getErr.message });
      res.json(row);
    });
  });
};

module.exports = {
  getAllQuotes,
  addQuote,
  updateQuote,
  deleteQuote,
  toggleLike,
  toggleFavorite,
};
