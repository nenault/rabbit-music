const express = require("express");
const router = express.Router();
const axios = require("axios");
//  const Playlist = require("../models/playlist");

router.get("/create-playlist/:id", function (req, res, next) {
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
         console.log(response.data);
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

/* const newPlaylist = req.body;
    const dbResult = await Playlist.create(newPlaylist); */

module.exports = router;
