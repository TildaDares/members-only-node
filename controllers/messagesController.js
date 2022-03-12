const Message = require("../models/messages");
const { body, validationResult } = require("express-validator");

exports.index = function (req, res, next) {
  Message.find({})
    .populate("user")
    .exec(function (err, results) {
      if (err) {
        const error = new Error(err);
        next(error);
      }

      res.render("index", { messages: results, title: "Home" });
    });
};

exports.new = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 360 })
    .escape()
    .withMessage("Message content cannot be empty"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("new.ejs", { title: "New Message" });
      return;
    }

    let message = new Message({
      content: req.body.content,
      user: req.user._id,
      created_at: new Date(),
    });

    message.save(function (err, result) {
      if (err) {
        return next(err);
      }

      res.redirect("/");
    });
  },
];
