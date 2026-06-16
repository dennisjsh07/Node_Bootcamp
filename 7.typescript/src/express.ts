import express, { Request, Response } from "express";

const app = express();

enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

app.get("/", (req: Request, res: Response) => {
  res.status(HttpStatus.OK).json({ msg: "Hello world" });
});

app.listen(3000, () => {
  console.log("app running on server 3000");
});
