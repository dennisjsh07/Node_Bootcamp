const { User } = require("../models/user.js");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwtPassword = process.env.JWT_PASSWORD;
const saltRounds = 10;

const userRegister = asyncHandler(async (req, res) => {
  const newUser = {
    userId: req.body.userId.toLowerCase(),
    password: await bcrypt.hash(req.body.password, saltRounds),
    roles: req.body.roles,
  };

  const existingUser = await User.findOne({ userId: newUser.userId });
  if (existingUser) {
    return res.status(409).json({ success: false, msg: "User already exists" });
  }

  const user = await User.create(newUser);
  res
    .status(201)
    .json({ success: true, msg: "user created successfully", data: user });
});

const userLogin = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;

  const user = await User.findOne({ userId: userId.toLowerCase() });
  if (!user) {
    return res.status(404).json({ success: false, msg: "User Not Found" });
  }

  const isPwdValid = await bcrypt.compare(password, user.password);
  if (!isPwdValid) {
    return res.status(401).json({ success: false, msg: "invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.userId, roles: user.roles },
    jwtPassword,
    { expiresIn: "15m" },
  );
  res
    .status(200)
    .json({ success: true, msg: "User Login SuccessFully", auth: token });
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, msg: "All fileds are required" });
  }

  const user = await User.findOne({ userId: userId }).select("password");

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, msg: "Invalid current password" });
  }

  const hashPassword = await bcrypt.hash(newPassword, saltRounds);

  user.password = hashPassword;
  await user.save();

  res.status(200).json({ success: true, msg: "Password changed successfully" });
});

module.exports = { userRegister, userLogin, changePassword };
