var createError = require("http-errors");
var express = require("express");
var engine = require("ejs-locals");
var path = require("path");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var session = require("express-session");
var logger = require("morgan");
var helmet = require("helmet");
var compression = require("compression");
require("dotenv").config();

var membersOnlyRouter = require("./routes/members-only");

var app = express();

var mongoose = require("mongoose");
var dev_db_url =
  "mongodb+srv://beautifulchaos:coolpassword@cluster0.fjbko.mongodb.net/members-only?retryWrites=true&w=majority";
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// use ejs-locals for all ejs templates:
app.engine("ejs", engine);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Need to require the entire Passport config module so app.js knows about it
require("./config/passport");

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(helmet());
app.use(compression());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", membersOnlyRouter);

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

module.exports = app;
