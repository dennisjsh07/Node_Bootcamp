const express = require("express");
const {
  getUsers,
  getSingleUser,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/admin.js");
const { auth } = require("../middleware/auth.js");
const { isAdmin } = require("../middleware/admin.js");
const { booksPayloadValidate } = require("../types.js");
const upload = require("../middleware/upload.js");

const router = express.Router();

router.get("/users", auth, isAdmin, getUsers);

router.get("/users/:id", auth, isAdmin, getSingleUser);

router.post(
  "/createBook",
  auth,
  isAdmin,
  upload.single("image"),
  booksPayloadValidate,
  createBook,
);

router.patch(
  "/updateBook/:id",
  auth,
  isAdmin,
  upload.single("image"),
  booksPayloadValidate,
  updateBook,
);

router.delete("/deleteBook/:id", auth, isAdmin, deleteBook);

module.exports = router;
