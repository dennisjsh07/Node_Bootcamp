// https://nodejs.org/api/fs.html
// https://dev.to/shanu001x/file-system-nodejs-fs-module-1hg6

const fs = require("fs");
const path = require("path");

// ------Sync Operations------

// creating a folder
const dataFolder = path.join(__dirname, "data");
try {
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
    console.log("dataFolder created");
  } else {
    console.log("folder already exists");
  }
} catch (err) {
  console.log(err.message);
}

// creating a file
const filePath = path.join(dataFolder, "example.txt");
try {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "Hello From node.js");
    console.log("file created");
  } else {
    console.log("file already exists");
  }
} catch (err) {
  console.log(err.message);
}

// reading a file
try {
  if (!fs.existsSync(filePath)) {
    console.log("File does not exist");
  } else {
    const fileContent = fs.readFileSync(filePath, "utf8");
    console.log("Reading file content :", fileContent);
  }
} catch (err) {
  console.log(err);
}

// updating file content
try {
  if (!fs.existsSync(filePath)) {
    console.log("file does not exist");
  } else {
    fs.appendFileSync(filePath, "\nAdded a new line");
    console.log("file updated successfully");
  }
} catch (err) {
  console.log(err.message);
}

// deleting a file
try {
  if (!fs.existsSync(filePath)) {
    console.log("file does not exist");
  } else {
    fs.unlinkSync(filePath);
    console.log("file deleted successfully");
  }
} catch (err) {
  console.log(err.message);
}

// ------Async Operations------

const asyncfilePath = path.join(dataFolder, "asycFile.txt");

fs.writeFile(asyncfilePath, "Hello world!", (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("File created SuccessFully");

  fs.readFile(asyncfilePath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);

    fs.appendFile(asyncfilePath, "\nNew line added", (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("file updated");

      fs.readFile(asyncfilePath, "utf8", (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(data);

        fs.unlink(asyncfilePath, (err) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("file deleted successfully");
        });
      });
    });
  });
});
