const { Books } = require("../models/books.js");
const { Orders } = require("../models/orders.js");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const getBooks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const books = await Books.find({})
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({ success: true, data: books });
});

const getSingleBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, msg: "Invalid Book Id" });
  }

  const book = await Books.findOne({ _id: id });
  if (!book) {
    return res.status(404).json({ success: false, msg: "Book not found" });
  }

  res.status(200).json({ success: true, data: book });
});

const purchaseBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, msg: "Invalid book id" });
  }

  const book = await Books.findById(id);
  if (!book) {
    return res.status(400).json({ success: false, msg: "Book not found" });
  }

  const user = req.user._id;

  await Orders.updateOne(
    { user },
    { $addToSet: { books: id } },
    { upsert: true },
  );
  res.status(201).json({ success: true, msg: "Book Purchased Successfully" });
});

const getPurchases = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limt || 10;

  const orders = await Orders.findOne({ user: req.user._id });
  if (!orders || orders.books.length === 0) {
    return res.status(200).json({ success: true, data: [] });
  }

  const books = await Books.find({ _id: { $in: orders.books } })
    .select("bookName authorName createdAt")
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({ success: true, data: books });
});

module.exports = { getBooks, getSingleBook, purchaseBook, getPurchases };
