import express from "express";
import { prisma } from "./lib/prisma";

const app = express();

app.use(express.json());

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default app;