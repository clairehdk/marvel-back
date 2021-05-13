const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const cors = require("cors");
router.use(cors());
router.use(formidable());

// Importer le model
const User = require("../models/User");

// Inscription
router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.fields;

    const userMail = await User.findOne({ email: email });
    const userName = await User.findOne({ username: username });

    if (userMail) {
      res.status(400).json("Ce mail est déjà lié à un compte.");
      console.log(email);
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
        res.status(200).json({
          _id: newUser.id,
          token: newUser.token,
          email: newUser.email,
          username: newUser.email,
        });
      } else {
        res.status(400).json("Veuillez remplir les champs manquants.");
      }
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// Connexion

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.fields;
    if (password && email) {
      const user = await User.findOne({
        email: email,
      });
      if (user) {
        if (SHA256(password + user.salt).toString(encBase64) === user.hash) {
          res.json({
            _id: user._id,
            token: user.token,
            email: user.email,
          });
        } else {
          res.status(401).json({ error: "Unauthorized" });
        }
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.status(400).json({ error: "Missing parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
