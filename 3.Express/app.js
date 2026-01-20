const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const jwtPassword = "Password@123";

const port = 3000;

const app = express();

app.use(express.json());

function validateTodosInput(req, res, next) {
  const schema = z.object({
    title: z.string(),
    description: z.string(),
  });

  const inputBody = {
    title: req.body.title,
    description: req.body.description,
  };

  const result = schema.safeParse(inputBody);

  if (!result.success) {
    res.status(400).json({ msg: "wrong inputs" });
  } else {
    next();
  }
}

function userInputValidate(req, res, next) {
  const schema = z.object({
    userId: z.string(),
    password: z.string(),
  });

  const userPayload = {
    userId: req.body.userId,
    password: req.body.password,
  };

  const result = schema.safeParse(userPayload);

  if (!result.success) {
    res.status(400).json({ msg: "invalid inputs" });
    return;
  }
  next();
}

function decodeJwt(req, res, next) {
  const token = req.headers.authorization;
  const decodeToken = jwt.verify(token, jwtPassword);

  const userId = decodeToken.userId;

  const index = users.findIndex((i) => i.userId === userId);

  if (index === -1) {
    res.status(401).json({ msg: "Unauthorized" });
    return;
  }
  next();
}

let todos = [];
let users = [];

// add users
app.post("/signup", userInputValidate, (req, res) => {
  const newUser = {
    userId: req.body.userId,
    password: req.body.password,
  };

  users.push(newUser);
  res.status(200).json({ msg: "new user added", user: newUser });
});

// add signin for users
app.post("/signin", userInputValidate, (req, res) => {
  const user = {
    userId: req.body.userId,
    password: req.body.password,
  };

  const token = jwt.sign({ userId: user.userId }, jwtPassword);
  res.status(200).json({ msg: "user logged in successfully", token: token });
});

// get all todos
app.get("/", decodeJwt, (req, res) => {
  res.status(200).json(todos);
});

// post a todo with a rondom 6 digit ID
app.post("/", decodeJwt, validateTodosInput, (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 1000000),
    title: req.body.title,
    description: req.body.description,
  };
  todos.push(newTodo);
  res.status(200).json({ msg: "Todo added successfully" });
});

// get a particular todo
app.get("/:id", decodeJwt, (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((i) => i.id === id);
  if (index === -1) {
    res.status(404).json({ msg: "Todo not found" });
    return;
  }
  res.status(200).json(todos[index]);
});

// update a todo
app.put("/:id", decodeJwt, validateTodosInput, (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((i) => i.id === id);

  if (index === -1) {
    res.status(404).json({ msg: "Todo not found" });
    return;
  }

  const newTodo = {
    id: id,
    title: req.body.title,
    description: req.body.description,
  };
  todos[index] = newTodo;

  res
    .status(200)
    .json({ msg: "Todos updated successfully", updatedTodos: todos });
});

// delete a todo
app.delete("/:id", decodeJwt, (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((i) => i.id === id);

  if (index === -1) {
    res.status(404).json({ msg: "Todo not found" });
    return;
  }

  const deletedTodo = todos.splice(index, 1);
  res
    .status(200)
    .json({
      msg: "Todo deleted successfully",
      updatedTodos: todos,
      deletedTodo: deletedTodo,
    });
});

// add a global catch
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ msg: message });
});

app.listen(port, () => {
  console.log(`app running on port ${3000}`);
});
