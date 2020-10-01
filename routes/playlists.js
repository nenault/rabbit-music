const express = require("express");
const router = express.Router();
const axios = require("axios");
const Playlist = require("../models/playlist");
const User = require("../models/user");
const protectPrivateRoute = require("../middlewares/protectPrivateRoute");
const { all } = require("../app");

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

    // console.log(relatedPlaylist);
    const allSongsId = [];
    const objSongs = {};
    const idSongs = {};
    let i = 0;
    for (let playlist of relatedPlaylist) {
      const keyName = "playlist" + (i + 1);
      i++;
      objSongs[keyName] = [];
      allSongsId[keyName] = [];

      idSongs[keyName] = [];
      playlist.songs.splice(5);
      ids = playlist.songs.join(",");
      idSongs[keyName].push(ids);
      const { data: token } = await axios({
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
      });
      const response = await axios({
        url: `https://api.spotify.com/v1/tracks/?ids=${idSongs[keyName]}`,

        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          access_token: token.access_token,
          refresh_token: token.refresh_token,
        },
      });
      response.data.tracks.forEach((song) => {
        objSongs[keyName].push(song);
        // playlist.songs.push(objSongs[keyName][j].name)
      });
      playlist.details.push(...objSongs[keyName]);
    }
    // res.json(relatedPlaylist)
    res.render("related-playlists", { relatedPlaylist });
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
  try {
    const relatedPlaylist = await Playlist.find().populate("user");

    // console.log(relatedPlaylist);
    const allSongsId = [];
    const objSongs = {};
    const idSongs = {};
    let i = 0;
    for (let playlist of relatedPlaylist) {
      // console.log(playlist);
      const keyName = "playlist" + (i + 1);
      i++;
      objSongs[keyName] = [];
      allSongsId[keyName] = [];

      idSongs[keyName] = [];
      playlist.songs.splice(5);
      ids = playlist.songs.join(",");
      idSongs[keyName].push(ids);

      // console.log(idSongs[keyName]);
      const { data: token } = await axios({
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
      });
      const response = await axios({
        url: `https://api.spotify.com/v1/tracks/?ids=${idSongs[keyName]}`,

        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          access_token: token.access_token,
          refresh_token: token.refresh_token,
        },
      });
      response.data.tracks.forEach((song) => {
        objSongs[keyName].push(song);
      });
      playlist.details.push(...objSongs[keyName]);
    }
    // res.json(relatedPlaylist)
    res.render("connected/edit-user-playlists", {
      relatedPlaylist,
      userId: req.session.currentUser._id,
    });
  } catch (error) {
    next(error);
  }
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
        url: `https://api.spotify.com/v1/search?q=${req.params.query}&type=track,artist`,

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
    const relatedPlaylist = await Playlist.find().populate("user");

    // console.log(relatedPlaylist);
    const allSongsId = [];
    const objSongs = {};
    const idSongs = {};
    let i = 0;
    for (let playlist of relatedPlaylist) {
      // console.log(playlist);
      const keyName = "playlist" + (i + 1);
      i++;
      objSongs[keyName] = [];
      allSongsId[keyName] = [];

      idSongs[keyName] = [];
      playlist.songs.splice(5);
      ids = playlist.songs.join(",");
      idSongs[keyName].push(ids);

      // console.log(idSongs[keyName]);
      const { data: token } = await axios({
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
      });
      const response = await axios({
        url: `https://api.spotify.com/v1/tracks/?ids=${idSongs[keyName]}`,

        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          access_token: token.access_token,
          refresh_token: token.refresh_token,
        },
      });
      response.data.tracks.forEach((song) => {
        objSongs[keyName].push(song);
      });
      playlist.details.push(...objSongs[keyName]);
    }
    // res.json(relatedPlaylist)
    res.render("public-user-playlists", {
      relatedPlaylist,
    });
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
    const playlist = await Playlist.findById(playlistId).populate("user");
    //console.log(playlist.songs);
    const ids = playlist.songs;

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
            // console.log(response.data.tracks);
            // res.send(response.data.tracks);
            res.render("playlist", {
              playlist: playlist,
              songs: response.data.tracks,
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
});

router.get("/user/:id", async function (req, res, next) {
  try {
    const user = req.params.id;
    const relatedPlaylist = await Playlist.find({
      user: { $in: [user] },
    }).populate("user");

    let username = relatedPlaylist[0].user.username;

    const allSongsId = [];
    const objSongs = {};
    const idSongs = {};
    let i = 0;
    for (let playlist of relatedPlaylist) {
      // console.log(playlist);
      const keyName = "playlist" + (i + 1);
      i++;
      objSongs[keyName] = [];
      allSongsId[keyName] = [];

      idSongs[keyName] = [];
      playlist.songs.splice(5);
      ids = playlist.songs.join(",");
      idSongs[keyName].push(ids);

      // console.log(idSongs[keyName]);
      const { data: token } = await axios({
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
      });
      const response = await axios({
        url: `https://api.spotify.com/v1/tracks/?ids=${idSongs[keyName]}`,

        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          access_token: token.access_token,
          refresh_token: token.refresh_token,
        },
      });
      response.data.tracks.forEach((song) => {
        objSongs[keyName].push(song);
      });
      playlist.details.push(...objSongs[keyName]);
    }
    // res.json(relatedPlaylist)
    res.render("user-playlists", {
      relatedPlaylist,
      username: username,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/copy-playlist/:id", protectPrivateRoute, async function (
  req,
  res,
  next
) {
  try {
    const playlistId = req.params.id;

    const getPlaylist = await Playlist.findById(playlistId).select("-_id");
    let copiesNb = getPlaylist.copies;
    copiesNb++;

    const getPlaylisttoCount = await Playlist.findByIdAndUpdate(
      { _id: playlistId },
      { copies: copiesNb }
    );

    // console.log(getPlaylist);

    getPlaylist.user = req.session.currentUser._id;
    getPlaylist.copies = 0;
    Playlist.insertMany(getPlaylist);

    res.redirect("/playlists/manage-playlist");
  } catch (error) {
    next(error);
  }
});

router.get("/manage-playlist/import", protectPrivateRoute, async function (
  req,
  res,
  next
) {
  const data = req.session.currentUser.spotify;
  const namePlaylist = [];

  const { data: token } = await axios({
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
  });
  const accessToken = token.access_token;
  const refreshToken = token.refresh_token;

  let i = 0;
  const trackUrls = [];
  for (let playlist of data) {
    const keyName = "playlist" + (i + 1);
    i++;
    trackUrls.push(playlist.tracks.href);
    namePlaylist.push(playlist.name);
  }
  // console.log(namePlaylist);
  const promises = trackUrls.map((trackUrl) =>
    axios({
      url: trackUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    })
  );
  var fullArrCreate = [];
  let arrCreate = {};
  var arrNamePlaylist = [];
  var arrIdSongs = [];
  const finalArray = [];
  const response = await Promise.all(promises);
  const allDatas = response.map((res) => res.data);
  const fullSet = allDatas.map(function (res, i) {
    res.name = namePlaylist[i];
    // console.log(res.total);
    if (res.total != 0) {
      finalArray.push(res);
    }
  });
  const responseAutre = finalArray.map(function (res, i) {
    arrNamePlaylist[i] = [];
    arrIdSongs[i] = [];
    arrNamePlaylist[i].push(res.name);
    const encoreetencore = res.items.map(function (req, j) {
      // console.log(req.track.id);
      arrIdSongs[i].push(req.track.id);
    });
  });
  // console.log(arrIdSongs);
  // console.log(arrNamePlaylist);

  for (let i = 0; i < arrIdSongs.length; i++) {
    fullArrCreate[i] = {};
    fullArrCreate[i].name = arrNamePlaylist[i].join("");
    fullArrCreate[i].songs = arrIdSongs[i];
    fullArrCreate[i].user = req.session.currentUser._id;
  }

  console.log(fullArrCreate[0]);

  fullArrCreate.forEach(async (playlist) => {
    // console.log(playlist.name);
    // console.log(playlist.songs);
    // console.log(playlist.user);

    const createPlaylist = await Playlist.create({
      name: playlist.name,
      songs: playlist.songs,
      user: playlist.user,
      copies: 0,
    });
  });
  // console.log(finalArray);
  // res.json(finalArray);
  res.redirect("/playlists/manage-playlist");
});

router.get("/export/:id", protectPrivateRoute, async (req, res, next) => {
  try {
    const playlistId = req.params.id;
    const playlist = await Playlist.findById(playlistId).populate("user");
    const spotiId = playlist.user.spotifyid;

    req.session.playlistId = playlistId;

    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uri =
      process.env.URL + `/playlists/export-playlist/exported`;

    let scopes =
      "user-read-private user-read-email playlist-modify-public playlist-modify-private";
    res.redirect(
      "https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" +
        client_id +
        (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
        "&redirect_uri=" +
        encodeURIComponent(redirect_uri)
    );
  } catch (error) {
    next(error);
  }
});

router.get(
  "/export-playlist/exported",
  protectPrivateRoute,
  async (req, res, next) => {
    try {
      let code = req.query.code;
     
      const playlist = await Playlist.findById(req.session.playlistId).populate(
        "user"
      );

      playlist.songs = playlist.songs.map((i) => "spotify:track:" + i);

      const uriString = playlist.songs.toString();

      const data = {
        name: playlist.name,
        user: playlist.user.spotifyid,
      };

      const client_id = process.env.CLIENT_ID;
      const client_secret = process.env.CLIENT_SECRET;
      const redirect_uri =
        process.env.URL + "/playlists/export-playlist/exported";

      axios({
        url: "https://accounts.spotify.com/api/token",
        method: "post",
        params: {
          client_id,
          client_secret,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirect_uri,
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
            url: `https://api.spotify.com/v1/users/${data.user}/playlists`,
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded",
            },
            params: {
              access_token: accessToken,
              refresh_token: refreshToken,
            },
            data: {
              name: data.name,
            },
          })
            .then((response) => {
              const newPlaylistId = response.data.id;
              axios({
                url: `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`,
                method: "post",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                params: {
                  access_token: accessToken,
                  refresh_token: refreshToken,
                },
                data: {
                  uris: playlist.songs,
                },
              })
                .then((response) => {
                  res.redirect(`/playlists/${playlist.id}`);
                })
                .catch((err) => {
                  console.log(err);
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

module.exports = router;
