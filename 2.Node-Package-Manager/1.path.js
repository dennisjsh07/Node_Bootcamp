// https://nodejs.org/api/path.html
// https://www.geeksforgeeks.org/node-js/nodejs-path-module/

const path = require("path");

console.log("Directory Name:", path.dirname(__filename));
console.log("File Name:", path.basename(__filename));
console.log("Extension Name:", path.extname(__filename));

const joinPath = path.join("user", "documents", "node", "projects");
console.log("Join path :", joinPath);

const resolvePath = path.resolve("user", "documents", "node", "projects"); // gives a absolute URL
console.log("resolve path :", resolvePath);

const normalizePath = path.normalize("/user/.documents/../node/projects");
console.log("normalizePath :", normalizePath);
