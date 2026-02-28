const express = require("express");
const { User } = require("../models/user.js");
const { userPayloadValidate, loginPayloadValidate } = require("../types.js");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwtPassword = process.env.JWT_PASSWORD;
const saltRounds = 10;

const router = express.Router();

router.post(
  "/signup",
  userPayloadValidate,
  asyncHandler(async (req, res) => {
    const newUser = {
      userId: req.body.userId.toLowerCase(),
      password: await bcrypt.hash(req.body.password, saltRounds),
      roles: req.body.roles,
    };

    const existingUser = await User.findOne({ userId: newUser.userId });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const user = await User.create(newUser);
    res.status(201).json({ msg: "user created successfully", data: user });
  }),
);

router.post(
  "/signin",
  loginPayloadValidate,
  asyncHandler(async (req, res) => {
    const { userId, password } = req.body;

    const user = await User.findOne({ userId: userId.toLowerCase() });
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    const isPwdValid = await bcrypt.compare(password, user.password);
    if (!isPwdValid) {
      return res.status(401).json({ msg: "invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.userId, roles: user.roles },
      jwtPassword,
      { expiresIn: "15m" },
    );
    res.status(200).json({ msg: "User Login SuccessFully", auth: token });
  }),
);

module.exports = router;
