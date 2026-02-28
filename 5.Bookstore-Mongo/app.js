const express = require("express");
const rootRouter = require("./router/index.js");
const db = require("./db/index.js");

require("dotenv").config();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/api/v1", rootRouter);

/*
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMsg = err.message || "Internal server error";
  res.status(statusCode).json({ msg: errMsg });
});
*/

app.listen(port, () => {
  console.log(`app running on ${port}`);
});
