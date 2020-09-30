const express = require("express");
const router = express.Router();
const axios = require("axios");
const Playlist = require("../models/playlist");
const User = require("../models/user");
const protectPrivateRoute = require("../middlewares/protectPrivateRoute");

router.get("/init-playlist/:id", protectPrivateRoute, function (
  req,
  res,
  next
) {
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
            userId: req.session.currentUser._id,
            javascripts: ["playlists"],
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(function (error) {});
});

router.get("/see-all-playlists/:id", async function (req, res, next) {
  try {
    const songId = req.params.id;

    const relatedPlaylist = await Playlist.find({
      songs: { $in: [songId] },
    }).populate("user");

    console.log(relatedPlaylist);

    const objSongs = {};
    const idSongs = {};
    relatedPlaylist.forEach((playlist, i) => {
      const keyName = "playlist" + (i + 1);
      objSongs[keyName] = [];

      idSongs[keyName] = [];
      ids = playlist.songs.join(",");
      idSongs[keyName].push(ids);
      console.log(idSongs);

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
            url: `https://api.spotify.com/v1/tracks/?ids=${idSongs[keyName]}`,

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
              console.log(response.data.tracks);
              response.data.tracks.forEach((song) => {
                objSongs[keyName].push(song);
                console.log(objSongs);
              });
            })
            .catch((err) => {
              console.log(err);
            });
          res.render("related-playlists", {
            relatedPlaylist,
            objSongs,
          });
        })
        .catch(function (error) {});
    });
    // res.render("related-playlists", {
    //   arrayId : arrayId,
    //   relatedPlaylist,
    //   javascripts: ["playlists"],
    // });
  } catch (error) {
    next(error);
  }
});

router.post("/create-playlist", protectPrivateRoute, async function (
  req,
  res,
  next
) {
  const newPlaylist = req.body;

  let songListToarray = req.body.songs.split(",");

  const createPlaylist = await Playlist.create({
    name: req.body.name,
    user: req.body.user,
    songs: songListToarray,
    copies: req.body.copies,
  });

  res.redirect("/playlists/manage-playlist");
});

router.get("/manage-playlist", protectPrivateRoute, async function (
  req,
  res,
  next
) {
  // const newPlaylist = req.body;
  // console.log(newPlaylist);
  const displayPlaylist = await Playlist.find();
  // console.log(req.session.currentUser._id);
  res.render("connected/edit-user-playlists", {
    playlists: displayPlaylist,
    userId: req.session.currentUser._id,
  });
});

router.get("/delete-playlist/:id", protectPrivateRoute, async function (
  req,
  res,
  next
) {
  const playlistId = req.params.id;
  Playlist.findByIdAndDelete(playlistId)
    .then((dbResult) => {
      res.redirect("/playlists/manage-playlist");
    })
    .catch((error) => {
      next(error);
    });
});

router.get(
  "/edit-playlist/:id",
  protectPrivateRoute,
  async (req, res, next) => {
    try {
      const playlistId = req.params.id;
      const dbResult = await Playlist.findById(playlistId);

      let ids = dbResult.songs.join(",");

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
            url: `https://api.spotify.com/v1/tracks/?ids=${ids}`,

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
              const arrayId = [];

              response.data.tracks.forEach((song) => {
                arrayId.push(song.id);
              });

              res.render("connected/edit-playlist", {
                playlist: dbResult,
                songs: response.data.tracks,
                arrayId: arrayId,
                javascripts: ["playlists"],
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(function (error) {});
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/edit-playlist/:id",
  protectPrivateRoute,
  async (req, res, next) => {
    try {
      const playlistId = req.params.id;

      let songListToarray = req.body.songs.split(",");

      const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        name: req.body.name,
        songs: songListToarray,
      });
      res.redirect("/playlists/manage-playlist");
    } catch (error) {
      next(error);
    }
  }
);

router.get("/:state/:id/:query", protectPrivateRoute, function (
  req,
  res,
  next
) {
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
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      axios({
        url: `https://api.spotify.com/v1/search?q=${req.params.query}&type=track,artist&limit=6`,

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
          res.send(response.data.tracks.items);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(function (error) {});
});

router.get("/:state/:id/add-song/:ids", protectPrivateRoute, function (
  req,
  res,
  next
) {
  // console.log(req.params.ids);
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
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      axios({
        url: `https://api.spotify.com/v1/tracks/?ids=${req.params.ids}`,

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
          // console.log(response.data.tracks);
          res.send(response.data.tracks);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(function (error) {});
});

router.get("/all-playlists", async function (req, res, next) {
  try {
    const allPlaylists = await Playlist.find();
    res.render("public-user-playlists", { allPlaylists });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/edit-playlist/:id/delete-song",
  protectPrivateRoute,
  async function (req, res, next) {
    const playlistId = req.params.id;
    Playlist.findByIdAndDelete(playlistId)
      .then((dbResult) => {
        res.redirect("/playlists/manage-playlist");
      })
      .catch((error) => {
        next(error);
      });
  }
);

router.get("/:id", async function (req, res, next) {
  try {
    const playlistId = req.params.id;
    const playlist = await Playlist.findById(playlistId).populate("user");;
    res.render("playlist", { playlist: playlist });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
