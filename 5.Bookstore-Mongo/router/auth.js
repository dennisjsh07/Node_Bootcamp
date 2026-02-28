const express = require("express");
const { userPayloadValidate, loginPayloadValidate } = require("../types.js");
const { userRegister, userLogin } = require("../controllers/auth.js");

const router = express.Router();

router.post("/signup", userPayloadValidate, userRegister);

router.post("/signin", loginPayloadValidate, userLogin);

module.exports = router;
