const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456789";
const port = 3000;

const app = express();

app.use(express.json());

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ msg: "unauthorized" });
    return;
  }

  try {
    const decodeToken = jwt.verify(token, jwtPassword);
    const userId = decodeToken.userId;

    fs.readFile("./files/users.json", "utf-8", (err, data) => {
      if (err) {
        res.status(400).json({ err: err });
        return;
      }

      const users = JSON.parse(data);
      const user = users.find((i) => i.userId === userId);

      if (!user) {
        res.status(404).json({ msg: "User not found" });
        return;
      }

      req.user = user;

      next();
    });
  } catch (err) {
    res.status(401).json({ msg: "invalid token" });
    return;
  }
}

function isAdmin(req, res, next) {
  if (!req.user.roles || !req.user.roles.includes("Admin")) {
    res.status(403).json({ msg: "Admin access required" });
    return;
  }
  next();
}

app.post("/signup", (req, res) => {
  const newUser = {
    id: Math.floor(Math.random() * 1000000),
    userId: req.body.userId,
    password: req.body.password,
    roles: req.body.roles,
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
  const loginPayload = {
    userId: req.body.userId,
    password: req.body.password,
  };

  fs.readFile("./files/users.json", "utf-8", (err, data) => {
    if (err) {
      res.status(400).json({ err: err });
      return;
    }

    const users = JSON.parse(data);

    const user = users.find(
      (i) =>
        i.userId === loginPayload.userId &&
        i.password === loginPayload.password,
    );

    if (!user) {
      res.status(404).json({ msg: "user not found" });
      return;
    }

    const token = jwt.sign({ userId: loginPayload.userId }, jwtPassword);
    res.status(200).json({ msg: "user login successfully", token: token });
  });
});

app.get("/users", auth, isAdmin, (req, res) => {
  fs.readFile("./files/users.json", "utf-8", (err, data) => {
    if (err) {
      res.status(400).json({ err: err });
      return;
    }

    const users = JSON.parse(data);
    res.status(200).json({ data: users });
  });
});

app.get("/users/:id", auth, isAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile("./files/users.json", "utf-8", (err, data) => {
    if (err) {
      res.status(400).json({ err: err });
      return;
    }

    const users = JSON.parse(data);

    const user = users.find((i) => i.id === id);
    res.status(200).json({ data: user });
  });
});

app.post("/createBook", auth, isAdmin, (req, res) => {
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
      res.status(200).json({ msg: "Book created successFully", data: newBook });
    });
  });
});

app.get("/books", auth, (req, res) => {
  fs.readFile("./files/books.json", "utf-8", (err, data) => {
    if (err) {
      res.status(400).json({ msg: err });
      return;
    }

    const books = JSON.parse(data);
    res.status(200).json({ data: books });
  });
});

app.get("/book/:bookId", auth, (req, res) => {
  const bookId = parseInt(req.params.bookId);

  fs.readFile("./files/books.json", "utf-8", (err, data) => {
    if (err) {
      res.status(400).json({ err: err });
      return;
    }

    const books = JSON.parse(data);
    index = books.findIndex((i) => i.id === bookId);

    if (index === -1) {
      res.status(404).json({ msg: "Not found" });
      return;
    }

    res.status(200).json({ data: books[index] });
  });
});

app.post("/purchase/:bookId", auth, (req, res) => {
  const bookId = parseInt(req.params.bookId);
  // construct the payload, pass bookId from params and userId from jwt token
  const cart = {
    userId: req.user.userId,
    books: [bookId],
    createdAt: new Date(),
  };

  // read the file and get data
  fs.readFile("./files/purchasedBooks.json", "utf-8", (err, data) => {
    if (err) {
      res.status(400).json({ err: err });
      return;
    }
    const purchaseDocs = JSON.parse(data);

    const getUser = purchaseDocs.find((i) => i.userId === cart.userId);

    if (!getUser) {
      // insert cart data into the file, send response and return
      purchaseDocs.push(cart);
    } else {
      // only update the books array, send response and return
      getUser.books.push(bookId);
      getUser.updatedAt = new Date();
    }
    fs.writeFile(
      "./files/purchasedBooks.json",
      JSON.stringify(purchaseDocs),
      (err) => {
        if (err) {
          res.status(400).json({ err: err });
          return;
        }
        res.status(201).json({ msg: "Book purchased successfully" });
      },
    );
  });
});

app.get("/purchases", auth, (req, res) => {
  fs.readFile("./files/purchasedBooks.json", "utf-8", (err, data) => {
    if (err) {
      res.status(400).json({ err: err });
      return;
    }
    const purchaseData = JSON.parse(data);
    const userData = purchaseData.filter((i) => i.userId === req.user.userId);
    console.log(userData);
    fs.readFile("./files/books.json", "utf-8", (err, data) => {
      if (err) {
        res.status(400).json({ msg: err });
        return;
      }
      const books = JSON.parse(data);
      const booksData = books.filter((i) => userData[0].books.includes(i.id));
      res.status(200).json({ data: booksData });
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

// admin api's
// create api to see all users - done
// create api to view data of a particular user - done
// create api to create books - done

// user api's
// create api to create users - done
// create api for users to login  - done
// create api to get all books - done
// create api to get a particular book - done
// crate a api where a user can purchase a book - done
// create a api where the user can view all the books purchased by him - done

// implement zod for input validation

// implement jwt for authentication done

// hash password using bcrypt

// implement global catch done

// there is a lot of repetitive code for create try to create a single global function and reuse it

// git todos
// push multiple commits from sub branch before creating a PR
// push a commit, create a pr and repeate the same once again before merging
// push a commit, create a pr, merge and repeate the same cycle again
