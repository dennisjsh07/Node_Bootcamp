const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.log("MongoDB connection error", err));

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const booksSchema = new mongoose.Schema(
  {
    bookName: { type: String, required: true },
    authorName: { type: String, required: true },
  },
  { timestamps: true },
);

const ordersSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Books" }],
});

const User = mongoose.model("User", userSchema);
const Books = mongoose.model("Books", booksSchema);
const Orders = mongoose.model("Orders", ordersSchema);

module.exports = {
  User,
  Books,
  Orders,
};
