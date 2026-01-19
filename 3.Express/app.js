const express = require("express");
const z = require("zod");

const port = 3000;

const app = express();

app.use(express.json());

function validateInput(req, res, next) {
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

let todos = [];

// get all todos
app.get("/", (req, res) => {
  res.status(200).json(todos);
});

// post a todo with a rondom 6 digit ID
app.post("/", validateInput, (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 1000000),
    title: req.body.title,
    description: req.body.description,
  };
  todos.push(newTodo);
  res.status(200).json({ msg: "Todo added successfully" });
});

// get a particular todo
app.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((i) => i.id === id);
  if (index === -1) {
    res.status(404).json({ msg: "Todo not found" });
    return;
  }
  res.status(200).json(todos[index]);
});

// update a todo
app.put("/:id", validateInput, (req, res) => {
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
app.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((i) => i.id === id);

  if (index === -1) {
    res.status(404).json({ msg: "Todo not found" });
    return;
  }

  let arr = [];
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id !== id) {
      arr.push(todos[i]);
    }
  }

  todos = arr;
  res
    .status(200)
    .json({ msg: "Todo deleted successfully", updatedTodos: todos });
});

// add a global catch
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ msg: message });
});

// integrate jwt token

app.listen(port, () => {
  console.log(`app running on port ${3000}`);
});
