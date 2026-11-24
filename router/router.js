const express = require("express");
const router = express.Router();

// Fetching the components from the controller
const {
  getAllQuotes,
  addQuote,
  updateQuote,
  deleteQuote,
  toggleLike,
  toggleFavorite,
} = require("../controllers/controller.js");

router.get("/get-quotes", getAllQuotes);
router.post("/add-quote", addQuote);
router.put("/quotes/:id", updateQuote);
router.delete("/quotes/:id", deleteQuote);
router.post("/quotes/:id/like", toggleLike);
router.post("/quotes/:id/favorite", toggleFavorite);

module.exports = router;
