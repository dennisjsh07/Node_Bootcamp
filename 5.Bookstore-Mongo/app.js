const express = require("express");
const jwt = require("jsonwebtoken");
const { User, Books } = require("./db/index.js");
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

app.post("/signup", async (req, res, next) => {
  try {
    const { userId, password, roles } = req.body;

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const newUser = await User.create({ userId, password, roles });
    res.status(200).json({ msg: "user created successfully", data: newUser });
  } catch (err) {
    next(err);
  }
});

app.post("/signin", async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findOne({ userId: userId, password: password });
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    const token = jwt.sign({ userId: req.body.userId }, jwtPassword);
    res.status(200).json({ msg: "User Login SuccessFully", auth: token });
  } catch (err) {
    next(err);
  }
});

app.get("/users", auth, isAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find({})
      .select("-passoword")
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ data: users });
  } catch (err) {
    next(err);
  }
});

app.get("/users/:id", auth, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid User Id" });
    }

    const user = await User.findOne({ _id: id }).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
});

app.post("/createBook", async (req, res, next) => {
  try {
    const { bookName, authorName } = req.body;
    const newBook = await Books.create({ bookName, authorName });
    res.status(201).json({ msg: "book created successfully", data: newBook });
  } catch (err) {
    next(err);
  }
});

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
// create api to create books

// user api's
// create api to create users - done
// create api for users to login
// create api to get all books
// create api to get a particular book
// crate a api where a user can purchase a book
// create a api where the user can view all the books purchased by him

// implement zod for input validation on (signup, signin, createbooks)

// implement jwt for authentication

// hash password using bcrypt

// implement global catch

// there is a lot of repetitive code for create try to create a single global function and reuse it

// modularise the code

// include pagination

// what are the procedurse to be followed if i change the schema of a collection which is already having data
