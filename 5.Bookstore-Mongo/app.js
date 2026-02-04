const express = require("express");
const jwt = require("jsonwebtoken");
const z = require("zod");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const asyncHandler = require("express-async-handler");

const { User, Books, Orders } = require("./db/index.js");
const mongoose = require("mongoose");

require("dotenv").config();

const port = process.env.PORT;
const jwtPassword = process.env.JWT_PASSWORD;

const app = express();

app.use(express.json());

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "unauthorized" });
    }

    const token = authHeader.split(" ");

    const decodeToken = jwt.verify(token[1], jwtPassword);

    const user = await User.findOne({ userId: decodeToken.userId }).select(
      "_id userId roles",
    );

    if (!user) {
      return res.status(401).json({ msg: "unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
}

function isAdmin(req, res, next) {
  if (!req.user.roles || !req.user.roles.includes("Admin")) {
    return res.status(403).json({ msg: "Admin access required" });
  }
  next();
}

function userPayloadValidate(req, res, next) {
  const schema = z.object({
    userId: z.string(),
    password: z.string(),
    roles: z.array(z.string()),
  });

  const userPayload = {
    userId: req.body.userId,
    password: req.body.password,
    roles: req.body.roles,
  };

  const result = schema.safeParse(userPayload);
  if (!result.success) {
    return res.status(400).json({ msg: "Wrong Inpugs" });
  }
  next();
}

function loginPayloadValidate(req, res, next) {
  const schema = z.object({
    userId: z.string(),
    password: z.string(),
  });

  const inputBody = {
    userId: req.body.userId,
    password: req.body.password,
  };

  const result = schema.safeParse(inputBody);
  if (!result.success) {
    return res.status(400).json({ msg: "Wrong inputs" });
  }
  next();
}

function booksPayloadValidate(req, res, next) {
  const schema = z.object({
    bookName: z.string(),
    authorName: z.string(),
  });

  const inputBody = {
    bookName: req.body.bookName,
    authorName: req.body.authorName,
  };

  const result = schema.safeParse(inputBody);
  if (!result) {
    return res.status(400).json({ msg: "Invalid Inputs" });
  }
  next();
}

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
  "/users",
  auth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find({})
      .select("-passoword")
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ data: users });
  }),
);

app.get(
  "/users/:id",
  auth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid User Id" });
    }

    const user = await User.findOne({ _id: id }).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    res.status(200).json({ data: user });
  }),
);

app.post(
  "/createBook",
  auth,
  isAdmin,
  booksPayloadValidate,
  asyncHandler(async (req, res) => {
    const { bookName, authorName } = req.body;
    const newBook = await Books.create({ bookName, authorName });
    res.status(201).json({ msg: "book created successfully", data: newBook });
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

// implement golbal try catch

// modularise the code

// include pagination - done

// what are the procedurse to be followed if i change the schema of a collection which is already having data
