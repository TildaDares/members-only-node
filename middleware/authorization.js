exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) return next();

  req.flash("alert", "You need to be logged in to access this page!");
  res.redirect("/");
};

exports.isFullMember = function (req, res, next) {
  if (req.user.membership_status == "Elite") {
    req.flash("notice", "You are already a full member");
    res.redirect("/");
  } else {
    return next();
  }
};

exports.isAdmin = function (req, res, next) {
  if (req.user.isAdmin) return next();

  req.flash("alert", "Only admins can access this page!");
  res.redirect("/");
};
