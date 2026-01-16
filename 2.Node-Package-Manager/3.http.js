// https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener

const http = require("http");
const port = 3000;

const server = http.createServer((req, res) => {
  //console.log(req);
  const url = req.url;
  if (url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        data: "Hello world",
      })
    );
  } else if (url === "/projects") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("projects");
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("!404 page not found");
  }
});

server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
