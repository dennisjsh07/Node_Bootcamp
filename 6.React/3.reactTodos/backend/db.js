import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/todos";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Mongodb connected successfully"))
  .catch((err) => console.log("Mongodb connection error", err));

const todoSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    completed: { type: Boolean },
  },
  { timestamps: true },
);

const Todos = mongoose.model("Todos", todoSchema);

export { Todos };
