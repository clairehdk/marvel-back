const express = require("express");
const formidable = require("express-formidable");
const app = express();
require("dotenv").config();

const comics = require("./routes/comics");
const characters = require("./routes/characters");
const user = require("./routes/user");
app.use(user);
app.use(comics);
app.use(characters);

app.all("*", (req, res) => {
  res.status(404).json("Page not found");
});

app.listen(3001, () => {
  console.log("Server started");
});
