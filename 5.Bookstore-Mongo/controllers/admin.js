const asyncHandler = require("express-async-handler");
const { Books } = require("../models/books.js");
const { User } = require("../models/user.js");
const mongoose = require("mongoose");

const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const users = await User.find({})
    .select("-passoword")
    .skip((page - 1) * limit)
    .limit(limit);
  res.status(200).json({ success: true, data: users });
});

const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ sucess: false, msg: "Invalid User Id" });
  }

  const user = await User.findOne({ _id: id }).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, msg: "user not found" });
  }

  res.status(200).json({ succss: true, data: user });
});

const createBook = asyncHandler(async (req, res) => {
  const { bookName, authorName } = req.body;
  const newBook = await Books.create({ bookName, authorName });
  res
    .status(201)
    .json({ success: true, msg: "book created successfully", data: newBook });
});

module.exports = { getUsers, getSingleUser, createBook };
