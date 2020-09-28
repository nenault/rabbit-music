function protectPrivateRoute(req, res, next) {
    if (req.session.currentUser) next();
    else res.redirect("/auth/signin");
};

module.exports = protectPrivateRoute