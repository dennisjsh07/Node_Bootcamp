const asyncHandler = require("express-async-handler");
const { Books } = require("../models/books.js");
const { User } = require("../models/user.js");
const mongoose = require("mongoose");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../helpers/cloudinary.js");
const fs = require("fs");

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
  // console.log(req.body);
  // console.log(req.file);
  const { bookName, authorName } = req.body;

  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, msg: "cover image is required" });
  }

  const { url, publicId } = await uploadToCloudinary(req.file.path);

  const newBook = await Books.create({
    bookName,
    authorName,
    coverImage: { url, publicId },
  });

  // delete the file from local uploads folder after uploading to cloudinary
  /*
  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });
  */

  res
    .status(201)
    .json({ success: true, msg: "book created successfully", data: newBook });
});

const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, msg: "Invalid book id" });
  }

  // find book
  const book = await Books.findOne({ _id: id });
  if (!book) {
    return res.status(404).json({ success: false, msg: "Book not found" });
  }

  const { bookName, authorName } = req.body;
  if (bookName) book.bookName = bookName;
  if (authorName) book.authorName = authorName;

  // if new image is uploaded
  if (req.file) {
    // delete old image
    await deleteFromCloudinary(book.coverImage.publicId);

    // upload new image
    const { url, publicId } = await uploadToCloudinary(req.file.path);
    book.coverImage = {
      url: url,
      publicId: publicId,
    };

    // update database
    await book.save();

    // delete the file from local uploads folder after uploading to cloudinary
    /*
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });
    */

    res.status(200).json({
      status: true,
      msg: "Book updated successfully",
      data: book,
    });
  }
});

const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, msg: "Book Id not found" });
  }

  // find book:
  const book = await Books.findOne({ _id: id });
  if (!book) {
    return res.status(404).json({ success: false, msg: "Book not found" });
  }

  // delete img from cloudinary
  await deleteFromCloudinary(book.coverImage.publicId);

  // delete book from db
  await Books.deleteOne({ _id: id });
  res.status(200).json({ success: true, msg: "Book deleted successfully" });
});

module.exports = {
  getUsers,
  getSingleUser,
  createBook,
  updateBook,
  deleteBook,
};
