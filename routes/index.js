const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Rabbeat Music", javascripts: ["search"], nonavbar: true, navbarhome : true });
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
      let search = req.query.song.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      axios({
        url: `https://api.spotify.com/v1/search?q=${search}&type=track,artist&market=FR`,

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
        //  console.log(response.data.tracks.items[0]);
        //console.log(response.data.tracks.items[1]);
          res.render("song-search-results", {
            results: response.data.tracks.items,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(function (error) {});
});

module.exports = router;
