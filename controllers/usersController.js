const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

exports.signUpGet = function (req, res, next) {
  res.render("users/authentication", { title: "Sign Up", action: "/sign-up" });
};

exports.signUpPost = [
  body("username").isLength({ min: 1 }).withMessage("Username is required"),
  body("username")
    .custom(async (username) => {
      const user = await User.findOne({ username: username });
      if (user) {
        throw new Error("Username is already in use");
      }

      return true;
    })
    .withMessage("Username is already in use"),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    })
    .withMessage(
      "Password must be greater than 8 characters and contains at least one uppercase letter, one lowercase letter, one symbol, and one number"
    ),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }

    // Indicates the success of this synchronous custom validator
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("users/authentication", {
        title: "Sign Up",
        action: "/sign-up",
        username: req.body.username,
        errors: errors.array(),
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return next(err);
      // otherwise, store hashedPassword in DB
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      });

      user.save((err) => {
        if (err) return next(err);

        req.login(user, function (err) {
          if (err) {
            return next(err);
          }

          req.flash("notice", "Successfully signed in");
          res.redirect("/");
        });
      });
    });
  },
];

exports.loginGet = function (req, res, next) {
  res.render("users/authentication", { title: "Sign In", action: "/login" });
};

exports.loginPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: { type: "alert" },
});

exports.logout = function (req, res, next) {
  req.logout();
  res.redirect("/");
};
