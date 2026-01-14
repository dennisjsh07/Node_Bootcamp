function add(a, b) {
  return a + b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot Perform division by zero");
  }

  return Math.floor(a / b);
}

module.exports = {
  add,
  divide,
};
