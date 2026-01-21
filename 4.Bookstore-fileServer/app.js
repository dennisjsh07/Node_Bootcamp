const express = require("express");
const fs = require("fs");
const port = 3000;

const app = express();

app.use(express.json());

app.post("/signup", (req, res) => {
  const newUser = {
    id: Math.floor(Math.random() * 1000000),
    userId: req.body.userId,
    password: req.body.password,
    createdAt: new Date(),
  };

  fs.readFile("./files/users.json", "utf-8", (err, data) => {
    if (err) {
      res.status(400).json({ msg: err });
      return;
    }

    const users = JSON.parse(data);
    users.push(newUser);

    fs.writeFile("./files/users.json", JSON.stringify(users), (err) => {
      if (err) {
        res.status(400).json({ msg: err });
        return;
      }
      res
        .status(200)
        .json({ msg: "New user added successfully", newUser: newUser });
    });
  });
});

app.post("/signin", (req, res) => {
  // write code after implementing authentication
});

app.post("/createBook", (req, res) => {
  const newBook = {
    id: Math.floor(Math.random() * 1000000),
    bookName: req.body.bookName,
    authorName: req.body.authorname,
    createdAt: new Date(),
  };

  fs.readFile("./files/books.json", "utf-8", (err, data) => {
    if (err) {
      res.status(400).json({ msg: err });
      return;
    }

    const books = JSON.parse(data);
    books.push(newBook);

    fs.writeFile("./files/books.json", JSON.stringify(books), (err) => {
      if (err) {
        res.status(400).json({ msg: err });
        return;
      }
      res
        .status(200)
        .json({ msg: "Book created successFully", newBook: newBook });
    });
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMsg = err.message || "Internal Server Error";
  res.status(statusCode).json({ msg: errMsg });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// start a express server - done

// create api to create users - done
// create api for users to login  - partially done

// create api to create books - done
// create api to get all books
// create api to get a particular book

// crate a api where a user can purchase a book
// create a api where the user can view all the books purchased by him

// implement zod for input validation

// implement jwt for authentication

// hash password using bcrypt

// implement global catch

// there is a lot of repetitive code for create try to create a single global function and reuse it
