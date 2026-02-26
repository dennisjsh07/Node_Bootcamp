const express = require("express");
const rootRouter = require("./router/index.js");

require("dotenv").config();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/api/v1", rootRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMsg = err.message || "Internal server error";
  res.status(statusCode).json({ msg: errMsg });
});

app.listen(port, () => {
  console.log(`app running on ${port}`);
});

// start a express server - done

// admin api's
// create api to see all users - done
// create api to view data of a particular user - done
// create api to create books - done

// user api's
// create api to create users - done
// create api for users to login - done
// create api to get all books - done
// create api to get a particular book - done
// crate a api where a user can purchase a book - done
// create a api where the user can view all the books purchased by him - done (use aggregate for the last one)

// implement zod for input validation on (signup, signin, createbooks) - done

// implement jwt for authentication - done

// hash password using bcrypt - done

// implement global catch - done

// implement golbal try catch - done

// modularise the code - done

// include pagination - done

// what are the procedurse to be followed if i change the schema of a collection which is already having data
