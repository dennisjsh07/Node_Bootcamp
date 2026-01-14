/**
 * exports : module.exports
 * imports : require
 *
 * Note : Every node.js file created will be put inside a function wrapper
 * (
 *  function wrapper(){
 *      node.js code
 *  }
 * )
 */

const mathOperations = require("./function");

console.log(mathOperations.add(2, 2));

try {
  console.log(mathOperations.divide(2, 0));
} catch (e) {
  console.log(e.message);
}
