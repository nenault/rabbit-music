module.exports = (req, res, next) => {
  req.session.currentUser = {
    _id: "5ec3aaa1dda5ba14c2c72fe8", // change the user id here to fit yor needs
    username: "demo-admin",
    role: "admin",
    email: "admin@sneaklove.com",
  };
  next();
};
