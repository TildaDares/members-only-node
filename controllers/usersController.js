const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.signUpGet = function (req, res, next) {
  res.render("users/sign-up", { title: "Sign Up" });
};

exports.signUpPost = function (req, res, next) {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    // if err, do something
    if (err) return next(err);
    // otherwise, store hashedPassword in DB
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    }).save((err) => {
      if (err) return next(err);

      res.redirect("/");
    });
  });
};

exports.loginGet = function (req, res, next) {
  res.render("users/sign-in", { title: "Login" });
};

exports.loginPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

exports.logout = function (req, res, next) {
  req.logout();
  res.redirect("/");
};
