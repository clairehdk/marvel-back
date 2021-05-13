const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const cors = require("cors");
router.use(cors());

mongoose.connect("mongodb://localhost/marvel", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Importer le model
const User = require("../models/User");

// Inscription
router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.fields;
    const userMail = await User.findOne({ email });
    const userName = await User.findOne({ username });

    if (userMail) {
      res.status(400).json("Ce mail est déjà lié à un compte.");
    } else if (userName) {
      res.status(400).json("Cet identifiant est déjà pris.");
    } else {
      if ((email, username, password)) {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(password + salt).toString(encBase64);

        const newUser = new User({
          email,
          username,
          token,
          salt,
          hash,
        });

        await newUser.save();
        res.status(200).json("Votre compte a bien été créé.");
      } else {
        res.status(400).json("Veuillez remplir les champs manquants.");
      }
    }
  } catch (e) {
    res.status(400).json(e.message);
  }
});

module.exports = router;
