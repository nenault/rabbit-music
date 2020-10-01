const express = require("express");
const router = new express.Router();
const axios = require("axios");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const salt = 10;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.URL +"/auth/redirect-spotify";

router.get("/signin", async (req, res, next) => {
  res.render("signin", { css: ["signin"] });
});

router.get("/signin-spotify", async (req, res, next) => {
  res.render("spotify-login", { css: ["signin"] });
});

router.get("/login-spotify", async (req, res, next) => {
  let scopes = "user-read-private user-read-email playlist-modify-public playlist-modify-private";
  res.redirect(
    "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" +
      client_id +
      (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
      "&redirect_uri=" +
      encodeURIComponent(redirect_uri)
  );
});

router.get("/redirect-spotify", async (req, res, next) => {
  try {
    let code = req.query.code;
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
    }).then(function (response) {
      // console.log("response.data.access_token");
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      axios({
        url: `https://api.spotify.com/v1/me`,

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

          try {
            (async () => {
              const newUser = {
                username: response.data.display_name,
                email: response.data.email,
                password: code,
                isSpotify: true,
                spotifyid: response.data.id
              };

              const foundUser = await User.findOne({ email: newUser.email });

              if (foundUser) {
                const user = {
                  email: response.data.email,
                };
                const foundUser = await User.findOne({ email: user.email });

                const userDocument = { ...foundUser };
                const userObject = foundUser.toObject();
                delete userObject.password;

                req.session.currentUser = userObject;

                
                
                (async () => {
                  const user = {
                    email: response.data.email,
                  };
                  const foundUser = await User.findOne({ email: user.email });

                  const userDocument = { ...foundUser };
                  const userObject = foundUser.toObject();
                  delete userObject.password;

                  req.session.currentUser = userObject;

                  axios({
                    url: `https://api.spotify.com/v1/me/playlists`,

                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    params: {
                      access_token: accessToken,
                    },
                  })
                    .then((response) => {
                      (async () => {
                        console.log(response.data.items);
                        const playlistArray = response.data.items;
                        
                        for (let i = 0; i < playlistArray.length; i++) {
                          console.log(playlistArray[i].tracks.href);
                          const playlistsList = playlistArray[i].tracks.href;
                          axios({
                            url: `${playlistsList}`,
                    
                            headers: {
                              Accept: "application/json",
                              "Content-Type": "application/x-www-form-urlencoded",
                            },
                            params: {
                              access_token: accessToken,
                            },
                          })
                            .then((response) => {
                            //console.log(response.data);
                              // res.send(response.data.tracks);
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                          
                        }

                        const query = { email: user.email };
                        const update = {
                          $set: {
                            spotify: response.data.items,
                          },
                        };

                        const dataUser = await User.findOneAndUpdate(
                          query,
                          update
                        );
                      })();
                    res.redirect("/");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })();

              } else {
                const hashedPassword = bcrypt.hashSync(newUser.password, salt);
                newUser.password = hashedPassword;
                const user = await User.create(newUser);

                (async () => {
                  const user = {
                    email: response.data.email,
                  };
                  const foundUser = await User.findOne({ email: user.email });

                  const userDocument = { ...foundUser };
                  const userObject = foundUser.toObject();
                  delete userObject.password;

                  req.session.currentUser = userObject;

                  axios({
                    url: `https://api.spotify.com/v1/me/playlists`,

                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    params: {
                      access_token: accessToken,
                    },
                  })
                    .then((response) => {
                      (async () => {
                        console.log(response.data.items);
                        const playlistArray = response.data.items;
                        
                        for (let i = 0; i < playlistArray.length; i++) {
                          console.log(playlistArray[i].tracks.href);
                          const playlistsList = playlistArray[i].tracks.href;
                          axios({
                            url: `${playlistsList}`,
                    
                            headers: {
                              Accept: "application/json",
                              "Content-Type": "application/x-www-form-urlencoded",
                            },
                            params: {
                              access_token: accessToken,
                            },
                          })
                            .then((response) => {
                            //console.log(response.data);
                              // res.send(response.data.tracks);
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                          
                        }

                        const query = { email: user.email };
                        const update = {
                          $set: {
                            spotify: response.data.items,
                          },
                        };

                        const dataUser = await User.findOneAndUpdate(
                          query,
                          update
                        );
                      })();
                    res.redirect("/");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })();
              }
            })();
          } catch (error) {
            next(error);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } catch (error) {
    next(error);
  }
});

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(req.body);
  const foundUser = await User.findOne({ email: email });
  // console.log(foundUser);
  if (!foundUser) {
    res.render("signin", { error_msg: "Invalide email/password combination" });
  } else {
    const isSamePassword = bcrypt.compareSync(password, foundUser.password);
    if (!isSamePassword) {
      res.render("signin", {
        error_msg: "Invalide email/password combination",
      });
    } else {
      const userDocument = { ...foundUser };
      // console.log(userDocument);
      const userObject = foundUser.toObject();
      delete userObject.password;

      req.session.currentUser = userObject;

      res.redirect("/");
    }
  }
});

router.get("/signup", async (req, res, next) => {
  res.render("signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    const newUser = req.body;

    const foundUser = await User.findOne({ email: newUser.email });

    if (foundUser) {
      res.render("signup", { error_msg: "Email already taken" });
    } else {
      const hashedPassword = bcrypt.hashSync(newUser.password, salt);
      newUser.password = hashedPassword;
      const user = await User.create(newUser);
      res.redirect("/auth/signin");
    }
  } catch (error) {
    next(error);
  }
});

router.get("/logout", async (req, res, next) => {
  console.log(req.session.currentUser);
  req.session.destroy(function (err) {
    res.redirect("/auth/signin");
  });
});

module.exports = router;
