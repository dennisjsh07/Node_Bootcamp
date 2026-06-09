import express from "express";
import { createTodoValidate, updateTodoValidate } from "./types.js";
import { Todos } from "./db.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/create-todo", async (req, res, next) => {
  try {
    const newTodo = req.body;
    const result = createTodoValidate.safeParse(newTodo);
    if (!result.success) {
      return res.status(411).json({ success: false, msg: "wrong inputs" });
    }

    await Todos.create({
      title: req.body.title,
      description: req.body.description,
      completed: false,
    });

    res.status(201).json({ success: true, msg: "Todo created successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.get("/todos", async (req, res, next) => {
  try {
    const todos = await Todos.find({});
    res.status(200).json({ success: true, data: todos });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.put("/todos/:id", async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const result = updateTodoValidate.safeParse(todoId);
    if (!result) {
      return res.status(211).json({ success: false, msg: "Wrong Inputs" });
    }

    await Todos.updateOne({ _id: todoId }, { completed: true });
    res.status(200).json({ success: true, msg: "Todo updated successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMsg = err.message || "Internal server error";
  res.status(statusCode).json({ msg: errMsg });
});

app.listen(3000, () => {
  console.log("App running on server 3000");
});
