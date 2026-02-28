const express = require("express");
const {
  getBooks,
  getSingleBook,
  purchaseBook,
  getPurchases,
} = require("../controllers/user.js");
const { auth } = require("../middleware/auth.js");

require("dotenv").config();

const router = express.Router();

router.get("/books", auth, getBooks);

router.get("/books/:id", auth, getSingleBook);

router.post("/purchase/:id", auth, purchaseBook);

router.get("/purchases", auth, getPurchases);

module.exports = router;
