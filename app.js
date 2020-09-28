require("dotenv").config();
require("./config/mongo");


const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const dev_mode = false;
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("hbs");
const mongoose = require("mongoose");
const axios = require("axios");


const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const playlistsRouter = require("./routes/playlists");
const navbarRouter = require("./routes/navbar");
const authRouter = require("./routes/auth");

const app = express();

// SESSION SETUP
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 6000000 }, // in millisec
    store: new MongoStore({
      mongooseConnection: mongoose.connection, // you can store session infos in mongodb :)
      ttl: 24 * 60 * 60, // 1 day
    }),
    saveUninitialized: true,
    resave: true,
  })
  );
  
  
  app.use(function (req, res, next) {
    if (req.session.currentUser) {
      res.locals.isLoggedIn = true;
      res.locals.isAdmin = req.session.currentUser.role === "admin";
      res.locals.username = req.session.currentUser.username;
    } else {
      res.locals.isLoggedIn = false;
      res.locals.username = null;
      res.locals.isAdmin = false;
    }
    next();
  });
  
  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "hbs");
  app.use(express.static(__dirname + "/public"));
  hbs.registerPartials(__dirname + "/views/partials");
  
  app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/playlists", playlistsRouter);
app.use("/navbar", navbarRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// CUSTOM MIDDLEWARES

if (dev_mode === true) {
  app.use(require("./middlewares/devMode")); // triggers dev mode during dev phase
  app.use(require("./middlewares/debugSessionInfos")); // displays session debug
}

app.use(require("./middlewares/exposeLoginStatus"));
app.use(require("./middlewares/exposeFlashMessage"));


module.exports = app;
