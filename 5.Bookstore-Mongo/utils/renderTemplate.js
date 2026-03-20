const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const renderTemplate = (filePath, data) => {
  const resolvedPath = path.resolve(__dirname, filePath);
  const source = fs.readFileSync(resolvedPath, "utf8");

  const template = handlebars.compile(source);

  const html = template(data);

  return html;
};

module.exports = renderTemplate;
