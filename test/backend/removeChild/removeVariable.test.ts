import { Elements } from "../../../src/types/Elements";
import {
  Component,
  ImportSource,
  Model,
  Parser,
  Printer,
  Units,
  Variable,
} from "../../../src/types/ILibcellml";
import FileManagement from "../../../src/backend/FileManagement";
import { convertSelectedElement } from "../../../src/backend/converter/ConvertElement";
import assert from "assert";
import { RemoveComponent } from "../../../src/backend/removeChild/removeComponent";
import { IChild } from "../../../src/types/IProperties";
import { removeVariable } from "../../../src/backend/removeChild/removeVariable";

describe("Removing CellML Variable into property format", function () {
  this.timeout(5000);
  it("Removing Variable", async () => {
    const fm = new FileManagement();
    await fm.init();
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const component: Component = new fm._cellml.Component();
    component.setName("c1");
    const v: Variable = new fm._cellml.Variable();
    v.setName("v1");
    v.setUnitsByName("kelvin");
    component.addVariable(v);
    m.addComponent(component);

    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(component, Elements.component);

    const child: IChild = {
      name: "v1",
      index: 0,
    };

    removeVariable(fm, child);

    const postRemoval = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const postModel = parser.parseModel(postRemoval);
    // Check attributes of element are preserved
    assert.strictEqual(
      postModel.componentByIndex(0).variableCount(),
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
