const express = require("express");
const port = 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`app running on ${port}`);
});

// start a express server - done

// admin api's
// create api to see all users 
// create api to view data of a particular user 
// create api to create books 

// user api's
// create api to create users 
// create api for users to login  
// create api to get all books 
// create api to get a particular book 
// crate a api where a user can purchase a book 
// create a api where the user can view all the books purchased by him 

// implement zod for input validation 

// implement jwt for authentication 

// hash password using bcrypt 

// implement global catch 

// there is a lot of repetitive code for create try to create a single global function and reuse it
