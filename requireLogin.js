function requireLogin(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Please login first" });
  }
}

module.exports = requireLogin;
