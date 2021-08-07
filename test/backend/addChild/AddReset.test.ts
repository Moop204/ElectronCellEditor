import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import {
  Component,
  Model,
  Parser,
  Printer,
  Variable,
} from "../../../src/types/ILibcellml";
import { Elements } from "../../../src/types/Elements";
import { ChildResetDetail } from "../../../src/types/ChildDetail";
import { addReset } from "../../../src/backend/addChild/addReset";

describe("Adding reset to component", function () {
  this.timeout(5000);

  it("Adds a reset component", async () => {
    const fm = new FileManagement();
    await fm.init();

    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");
    const c1: Component = new fm._cellml.Component();
    c1.setName("c1");
    const v1: Variable = new fm._cellml.Variable();
    v1.setName("v1");
    v1.setUnitsByName("second");

    c1.addVariable(v1);
    m.addComponent(c1);

    // Assigning model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(c1, Elements.component);

    // Applying update
    const mathValue =
      `<math xmlns="http://www.w3.org/1998/Math/MathML"><ci>v1</ci></math>`.trim();
    const child: ChildResetDetail = {
      type: Elements.component,
      attribute: {
        reset_variable: "v1",
        test_variable: "v1",
        order: 1,
        reset_value: mathValue,
        test_value: mathValue,
      },
    };

    addReset(fm, child);

    const updatedContent = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const newModel = parser.parseModel(updatedContent);
    assert.strictEqual(newModel.componentByIndex(0).resetCount(), 1);
    assert.strictEqual(newModel.componentByIndex(0).reset(0).order(), 1);
    assert.strictEqual(
      newModel.componentByIndex(0).reset(0).testVariable().name(),
      "v1"
    );
    assert.strictEqual(
      newModel.componentByIndex(0).reset(0).variable().name(),
      "v1"
    );
    assert.strictEqual(
      newModel.componentByIndex(0).reset(0).testValue().trim(),
      mathValue.trim()
    );
    assert.strictEqual(
      newModel.componentByIndex(0).reset(0).resetValue().trim(),
      mathValue.trim()
    );
  });
});
