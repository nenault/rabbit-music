const express = require("express");
const router = express.Router();
const axios = require("axios");
const Playlist = require("../models/playlist");

router.get("/init-playlist/:id", function (req, res, next) {
  //console.log(req.params.id);

  axios({
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    params: {
      grant_type: "client_credentials",
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: process.env.CLIENT_ID,
      password: process.env.CLIENT_SECRET,
    },
  })
    .then(function (response) {
      // console.log("response.data.access_token");
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      axios({
        url: `https://api.spotify.com/v1/tracks/${req.params.id}`,

        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      })
        .then((response) => {
          // console.log(response.data);
          res.render("connected/create-playlist", {
            song: response.data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(function (error) {});
});

router.post("/create-playlist", async function (req, res, next) {
  const newPlaylist = req.body;
  // console.log(newPlaylist);
  const createPlaylist = await Playlist.create(newPlaylist);

  res.redirect("/playlists/manage-playlist");
});

router.get("/manage-playlist", async function (req, res, next) {
  // const newPlaylist = req.body;
  // console.log(newPlaylist);
  const displayPlaylist = await Playlist.find();
  res.render("connected/edit-user-playlists", {
    playlists: displayPlaylist,
  });
});

router.get("/delete-playlist/:id", async function (req, res, next) {
 
 console.log("nico");
  const playlistId = req.params.id;
  Playlist.findByIdAndDelete(playlistId)
    .then((dbResult) => {
      res.redirect("/playlists/manage-playlist");
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
