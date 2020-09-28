module.exports = function exposeFlashMessage(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  res.locals.error_msg = req.flash("error_msg");
  next(); // passe la main au prochain middleware (si défini), sinon passe la main au callback d'une route
};
