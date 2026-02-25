const z = require("zod");

const userPayloadValidate = (req, res, next) => {
  const schema = z.object({
    userId: z.string(),
    password: z.string(),
    roles: z.array(z.string()),
  });

  const userPayload = {
    userId: req.body.userId,
    password: req.body.password,
    roles: req.body.roles,
  };

  const result = schema.safeParse(userPayload);
  if (!result.success) {
    return res.status(400).json({ msg: "Wrong Inpugs" });
  }
  next();
};

const loginPayloadValidate = (req, res, next) => {
  const schema = z.object({
    userId: z.string(),
    password: z.string(),
  });

  const inputBody = {
    userId: req.body.userId,
    password: req.body.password,
  };

  const result = schema.safeParse(inputBody);
  if (!result.success) {
    return res.status(400).json({ msg: "Wrong inputs" });
  }
  next();
};

const booksPayloadValidate = (req, res, next) => {
  const schema = z.object({
    bookName: z.string(),
    authorName: z.string(),
  });

  const inputBody = {
    bookName: req.body.bookName,
    authorName: req.body.authorName,
  };

  const result = schema.safeParse(inputBody);
  if (!result) {
    return res.status(400).json({ msg: "Invalid Inputs" });
  }
  next();
};

module.exports = {
  userPayloadValidate,
  loginPayloadValidate,
  booksPayloadValidate,
};
