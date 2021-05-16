const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const app = express();
app.use(formidable());
require("dotenv").config();

mongoose.connect("mongodb://localhost/marvel", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const comics = require("./routes/comics");
const characters = require("./routes/characters");
const user = require("./routes/user");
const favorites = require("./routes/favorite");
app.use(user);
app.use(comics);
app.use(characters);
app.use(favorites);

app.all("*", (req, res) => {
  res.status(404).json("Page not found");
});

app.listen(3001, () => {
  console.log("Server started");
});
