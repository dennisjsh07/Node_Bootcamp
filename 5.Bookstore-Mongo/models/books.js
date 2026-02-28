const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema(
  {
    bookName: { type: String, required: true },
    authorName: { type: String, required: true },
  },
  { timestamps: true },
);

const Books = mongoose.model("Books", booksSchema);

module.exports = { Books };
