const express = require("express");
const z = require("zod");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const asyncHandler = require("express-async-handler");
const rootRouter = require("./router/index.js");

const { User, Books, Orders } = require("./db/index.js");
const mongoose = require("mongoose");

require("dotenv").config();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use("/api/v1", rootRouter);

app.post(
  "/signup",
  userPayloadValidate,
  asyncHandler(async (req, res) => {
    const newUser = {
      userId: req.body.userId.toLowerCase(),
      password: await bcrypt.hash(req.body.password, saltRounds),
      roles: ["User"],
    };

    const existingUser = await User.findOne({ userId: newUser.userId });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const user = await User.create(newUser);
    res.status(201).json({ msg: "user created successfully", data: user });
  }),
);

app.post(
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

app.get(
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

app.get(
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

app.post(
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

app.get(
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

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMsg = err.message || "Internal server error";
  res.status(statusCode).json({ msg: errMsg });
});

app.listen(port, () => {
  console.log(`app running on ${port}`);
});

// start a express server - done

// admin api's
// create api to see all users - done
// create api to view data of a particular user - done
// create api to create books - done

// user api's
// create api to create users - done
// create api for users to login - done
// create api to get all books - done
// create api to get a particular book - done
// crate a api where a user can purchase a book - done
// create a api where the user can view all the books purchased by him - done (use aggregate for the last one)

// implement zod for input validation on (signup, signin, createbooks) - done

// implement jwt for authentication - done

// hash password using bcrypt - done

// implement global catch - done

// implement golbal try catch - done

// modularise the code -

// include pagination - done

// what are the procedurse to be followed if i change the schema of a collection which is already having data
