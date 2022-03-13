const Message = require("../models/messages");
const { body, validationResult } = require("express-validator");

exports.index = function (req, res, next) {
  Message.find({})
    .populate("user")
    .sort({ created_at: -1 })
    .exec(function (err, results) {
      if (err) {
        const error = new Error(err);
        next(error);
      }

      res.render("index", { messages: results, title: "Home" });
    });
};

exports.newGet = function (req, res, next) {
  res.render("messages/new", { title: "New Message" });
};

exports.newPost = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 360 })
    .escape()
    .withMessage("Message cannot be empty"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("messages/new", {
        title: "New Message",
        errors: errors.array(),
      });
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

exports.delete = function (req, res, next) {
  Message.findByIdAndRemove(req.params.id, function (err) {
    if (err) return next(err);

    req.flash("notice", "Message has been deleted!");
    res.redirect("/");
  });
};
