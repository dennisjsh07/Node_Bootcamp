const express = require("express");
const {
  getUsers,
  getSingleUser,
  createBook,
} = require("../controllers/admin.js");
const { auth } = require("../middleware/auth.js");
const { isAdmin } = require("../middleware/admin.js");
const { booksPayloadValidate } = require("../types.js");

const router = express.Router();

router.get("/users", auth, isAdmin, getUsers);

router.get("/users/:id", auth, isAdmin, getSingleUser);

router.post("/createBook", auth, isAdmin, booksPayloadValidate, createBook);

module.exports = router;
