const express = require("express");
const { userPayloadValidate, loginPayloadValidate } = require("../types.js");
const {
  userRegister,
  userLogin,
  changePassword,
  forgotPassword,
  resetPassword
} = require("../controllers/auth.js");
const { auth } = require("../middleware/auth.js");

const router = express.Router();

router.post("/signup", userPayloadValidate, userRegister);

router.post("/signin", loginPayloadValidate, userLogin);

router.patch("/change-password", auth, changePassword);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;
