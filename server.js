const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const routes = require("./router/router.js");

// Middleware
app.use(express.json()); // Allows server to read JSON sent from frontend
app.use(express.static("public")); // Serves your HTML/CSS/JS files

// Routes
// Fetch all quotes in JSON format
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
