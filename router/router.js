const express = require("express");
const router = express.Router();

// Fetching the components from the controller
const { getAllQuotes, AddQuotes } = require("../controllers/controller.js");

router.get("/get-quotes", getAllQuotes);
router.post("/add-quote", AddQuotes);

module.exports = router;
