const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", function (req, res, next) {
<<<<<<< HEAD
  res.render("index", { title: "Rabbeat music", javascripts: ["search"] });
=======
  res.render("index", { title: "Rabbeat Music", javascripts: ["search"] });
>>>>>>> b11f20744fe2a7ec0dc6cae24a6724b3c0584742
});

router.get("/search", function (req, res, next) {
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
        url: `https://api.spotify.com/v1/search?q=${req.query.song}&type=track,artist`,

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
      //  console.log(response.data.tracks.items);
          res.render("song-search-results", {
            results: response.data.tracks.items,
            javascripts: ["playlists"]
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(function (error) {});
});

module.exports = router;
