import { CellmlProcessor } from "../CellmlProcessor";
import { Model, Component } from "../../types/ILibcellml";
import FileManagement from "../FileManagement";

// Workaround until libcellml includes math validation
// and printer works on invalid MathML

// Function determines if the mathml given to it will
// cause the print to fail. Tries to print the mathml
// on a sample model and returns true if the resulting
// model can be printed.
// @fm      - State manager
// @mathml  - The string that represents the 'math',
//           'reset value' and 'test value' elements
const validMathMl = (processor: CellmlProcessor, mathml: string): boolean => {
  const m = processor.buildModel("m");
  const c1 = processor.buildComponent("c1");
  c1.setMath(mathml);
  m.addComponent(c1);
  const stringedModel = processor.printModel(m);
  return stringedModel !== "";
};

export { validMathMl };
