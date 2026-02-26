const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Books" }],
  },
  { timestamps: true },
);

const Orders = mongoose.model("Orders", ordersSchema);

module.exports = {
  Orders,
};
