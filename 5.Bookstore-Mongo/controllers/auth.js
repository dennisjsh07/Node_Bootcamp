const { User } = require("../models/user.js");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail.js");
const renderTemplate = require("../utils/renderTemplate.js");
require("dotenv").config();
const jwtPassword = process.env.JWT_PASSWORD;
const saltRounds = 10;
const crypto = require("crypto");

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

const forgotPassword = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  // console.log(userId)

  const user = await User.findOne({ userId: userId.toLowerCase() });
  if (!user) {
    return res.status(404).json({ success: false, msg: "user not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  // console.log("resetToken :", resetToken);

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log("hashedToken :", hashedToken);

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  const templateValue = {
    title: "Password Reset Request",
    userName: `Dear ${user.userId}`,
    sections: [
      {
        title: "",
        intro: "",
        body: "Click on the url below to reset your passoword",
        list: [],
      },
    ],
    tableHeader: "Reset Details",
    tableContent: [
      {
        name: "Portal URL",
        value: resetUrl,
        isLink: true,
        linkLabel: "Click here to Reset Your Password",
      },
    ],
    signOff: "Warm regards,",
    teamName: "buniq Book Store",
  };

  const html = renderTemplate(
    "../templates/notificationTemplate.html",
    templateValue,
  );

  // send mail
  await sendEmail({
    to: user.userId,
    subject: "Password Reset Request",
    html,
  });

  res
    .status(200)
    .json({ success: true, msg: "Password reset successfully", resetUrl });
});

const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token;
  // console.log("token :", token);

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // console.log("hashedToken :", hashedToken);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, msg: "Invalid or Expired token" });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  user.password = hashedPassword;
  user.resetPasswordExpiry = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  res.status(200).json({ success: true, msg: "Password reset successfull" });
});

module.exports = {
  userRegister,
  userLogin,
  changePassword,
  forgotPassword,
  resetPassword,
};
