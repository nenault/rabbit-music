const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Rabbit musicc", javascripts: ["search"] });
});

router.get("/login", function (req, res, next) {
  res.render("signin");
});

module.exports = router;