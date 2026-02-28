const isAdmin = (req, res, next) => {
  if (!req.user.roles || !req.user.roles.includes("Admin")) {
    return res
      .status(403)
      .json({ success: false, msg: "Admin access required" });
  }
  next();
};

module.exports = { isAdmin };
