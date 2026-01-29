const express = require("express");
const { User } = require("./db/index.js");
require("dotenv").config();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { userId, password, roles } = req.body;
  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const newUser = await User.create({ userId, password, roles });
    res.status(200).json({ msg: "user created successfully", data: newUser });
  } catch (err) {
    res.status(500).json({ err: err });
  }
});

app.listen(port, () => {
  console.log(`app running on ${port}`);
});

// start a express server - done

// admin api's
// create api to see all users
// create api to view data of a particular user
// create api to create books

// user api's
// create api to create users
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
