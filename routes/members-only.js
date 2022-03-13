var express = require("express");
var router = express.Router();
var messagesController = require("../controllers/messagesController");
var usersController = require("../controllers/usersController");

/* GET home page. */
router.get("/", messagesController.index);
router.get("/messages/new", messagesController.newGet);
router.post("/messages/new", messagesController.newPost);

/* Session routes */
router.get("/sign-up", usersController.signUpGet);
router.post("/sign-up", usersController.signUpPost);
router.post("/login", usersController.loginPost);
router.get("/login", usersController.loginGet);
router.get("/logout", usersController.logout);

module.exports = router;
