function protectPrivateRoute(req, res, next) {
    if (req.session.currentUser) next();
    else {
        req.flash("error_msg");
        res.redirect("/auth/signin");
    }
};

module.exports = protectPrivateRoute