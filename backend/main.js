const r = require("./build/Release/Reader");
let loc = "/home/moop204/Documents/uni/thesis/OpenCellEd/backend/example/4b1/complex_encapsulation.xml";
let x = r.importFile(
  loc
);
console.log(x);