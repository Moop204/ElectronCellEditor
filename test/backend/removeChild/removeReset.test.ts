import { Elements } from "../../../src/types/Elements";
import {
  Component,
  Model,
  Parser,
  Printer,
  Reset,
  Variable,
} from "../../../src/types/ILibcellml";
import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { IChild } from "../../../src/types/IProperties";
import { removeVariable } from "../../../src/backend/removeChild/removeVariable";
import { removeReset } from "../../../src/backend/removeChild/removeReset";

describe("Removing CellML Reset into property format", function () {
  this.timeout(5000);
  it("Removing Reset", async () => {
    const fm = new FileManagement();
    await fm.init();
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const component: Component = new fm._cellml.Component();
    component.setName("c1");
    const v: Variable = new fm._cellml.Variable();
    v.setName("v1");
    v.setUnitsByName("kelvin");
    const r: Reset = new fm._cellml.Reset();
    r.setOrder(1);
    const mathValue =
      `<math xmlns="http://www.w3.org/1998/Math/MathML"><ci>v1</ci></math>`.trim();
    r.setResetValue(mathValue);
    r.setTestValue(mathValue);
    r.setVariable(v);
    r.setTestVariable(v);
    component.addVariable(v);
    component.addReset(r);
    m.addComponent(component);

    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(component, Elements.component);

    const child: IChild = {
      name: "v1",
      index: 0,
    };

    removeReset(fm, child);

    const postRemoval = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const postModel = parser.parseModel(postRemoval);
    // Check attributes of element are preserved
    assert.strictEqual(
      postModel.componentByIndex(0).resetCount(),
      0,
      "No variables remain after removing only variable."
    );
    // Check children
    assert.strictEqual(
      fm.getCurrentComponent() instanceof fm._cellml.Component,
      true,
      "Current element remains the same"
    );
  });
});
