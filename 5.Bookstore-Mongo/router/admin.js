const express = require("express");
const asyncHandler = require("express-async-handler");
const { User, Books } = require("../db/index.js");
const { auth } = require("../middleware/auth.js");
const { isAdmin } = require("../middleware/admin.js");
const { booksPayloadValidate } = require("../types.js");
const asyncHandler = require("express-async-handler");

const router = express.Router();

router.get(
  "/users",
  auth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find({})
      .select("-passoword")
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ data: users });
  }),
);

router.get(
  "/users/:id",
  auth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid User Id" });
    }

    const user = await User.findOne({ _id: id }).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    res.status(200).json({ data: user });
  }),
);

router.post(
  "/createBook",
  auth,
  isAdmin,
  booksPayloadValidate,
  asyncHandler(async (req, res) => {
    const { bookName, authorName } = req.body;
    const newBook = await Books.create({ bookName, authorName });
    res.status(201).json({ msg: "book created successfully", data: newBook });
  }),
);

module.exports = router;
