var express = require("express");
var router = express.Router();
var messagesController = require("../controllers/messagesController");
var usersController = require("../controllers/usersController");
var authorization = require("../middleware/authorization");

/* GET home page. */
router.get("/", messagesController.index);

router.post(
  "/message/:id/delete",
  authorization.isAuthenticated,
  authorization.isAdmin,
  messagesController.delete
);

router.get(
  "/messages/new",
  authorization.isAuthenticated,
  messagesController.newGet
);

router.post(
  "/messages/new",
  authorization.isAuthenticated,
  messagesController.newPost
);

router.get(
  "/full-member",
  authorization.isAuthenticated,
  authorization.isFullMember,
  usersController.becomeFullMemberGet
);

router.post(
  "/full-member",
  authorization.isAuthenticated,
  authorization.isFullMember,
  usersController.becomeFullMemberPost
);

router.get(
  "/admin",
  authorization.isAuthenticated,
  authorization.isAdminEligible,
  usersController.becomeAdminGet
);

router.post(
  "/admin",
  authorization.isAuthenticated,
  authorization.isAdminEligible,
  usersController.becomeAdminPost
);

/* Session routes */
router.get(
  "/sign-up",
  authorization.isNotAuthenticated,
  usersController.signUpGet
);
router.post(
  "/sign-up",
  authorization.isNotAuthenticated,
  usersController.signUpPost
);
router.post(
  "/login",
  authorization.isNotAuthenticated,
  usersController.loginPost
);
router.get(
  "/login",
  authorization.isNotAuthenticated,
  usersController.loginGet
);
router.get("/logout", authorization.isAuthenticated, usersController.logout);

module.exports = router;
