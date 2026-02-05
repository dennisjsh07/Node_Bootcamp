const jwt = require("jsonwebtoken");

require("dotenv").config();

const jwtPassword = process.env.JWT_PASSWORD;

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "unauthorized" });
    }

    const token = authHeader.split(" ");

    const decodeToken = jwt.verify(token[1], jwtPassword);

    const user = await User.findOne({ userId: decodeToken.userId }).select(
      "_id userId roles",
    );

    if (!user) {
      return res.status(401).json({ msg: "unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

module.exports = { auth };
