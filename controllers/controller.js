const addQuotes = (req, res) => {
  db.all("SELECT * FROM quotes ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const postQuotes = (req, res) => {
  const { text, author } = req.body;
  if (!text) return res.status(400).json({ error: "Quote text is required" });

  const query = `INSERT INTO quotes (text, author) VALUES (?, ?)`;
  db.run(query, [text, author || "Anonymous"], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, text, author });
  });
};

module.exports = { addQuotes, postQuotes };
