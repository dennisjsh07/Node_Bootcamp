const express = require("express");
const { Books } = require("../models/books.js");
const { User } = require("../models/user.js");
const { Orders } = require("../models/orders.js");
const { userPayloadValidate, loginPayloadValidate } = require("../types.js");
const { auth } = require("../middleware/auth.js");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

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

    const token = jwt.sign({ userId: req.body.userId }, jwtPassword);
    res.status(200).json({ msg: "User Login SuccessFully", auth: token });
  }),
);

router.get(
  "/books",
  auth,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const books = await Books.find({})
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ data: books });
  }),
);

router.get(
  "/books/:id",
  auth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Book Id" });
    }

    const book = await Books.findOne({ _id: id });
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    res.status(200).json({ data: book });
  }),
);

router.post(
  "/purchase/:id",
  auth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid book id" });
    }

    const book = await Books.findById(id);
    if (!book) {
      return res.status(400).json({ msg: "Book not found" });
    }

    const user = req.user._id;

    await Orders.updateOne(
      { user },
      { $addToSet: { books: id } },
      { upsert: true },
    );
    res.status(201).json({ msg: "Book Purchased Successfully" });
  }),
);

router.get(
  "/purchases",
  auth,
  asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limt || 10;

    const orders = await Orders.findOne({ user: req.user._id });
    if (!orders || orders.books.length === 0) {
      return res.status(200).json({ data: [] });
    }

    const books = await Books.find({ _id: { $in: orders.books } })
      .select("bookName authorName createdAt")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ data: books });
  }),
);

module.exports = router;
