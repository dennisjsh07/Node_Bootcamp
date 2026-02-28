const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

require("dotenv").config();

const jwtPassword = process.env.JWT_PASSWORD;

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, msg: "unauthorized" });
    }

    const token = authHeader.split(" ");

    const decodeToken = jwt.verify(token[1], jwtPassword);

    const user = await User.findOne({
      userId: decodeToken.userId.toLowerCase(),
    }).select("_id userId roles");

    if (!user) {
      return res.status(401).json({ success: false, msg: "unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { auth };
