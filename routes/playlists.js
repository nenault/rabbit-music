const express = require("express");
const router = express.Router();
//  const Playlist = require("../models/playlist");

router.get("/create-playlist/:id", function (req, res, next) {
    console.log(req.params.id);
  res.render("connected/create-playlist", { song: req.params.id});
});

/* const newPlaylist = req.body;
    const dbResult = await Playlist.create(newPlaylist); */

module.exports = router;
