function requireAuth(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    req.flash("error", "Forbidden");
    res.redirect("/auth/signin");
  }
}

module.exports = requireAuth;
