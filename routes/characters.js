const axios = require("axios");
const express = require("express");
const router = express.Router();
const cors = require("cors");
router.use(cors());

// Récupération des comics via l'API Marvel
router.get("/characters", async (req, res) => {
  try {
    const { name, limit, skip } = req.query;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}&name=${name}&limit=${limit}&skip=${skip}`
    );
    res.status(200).json(response.data);
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
  }
});

module.exports = router;
