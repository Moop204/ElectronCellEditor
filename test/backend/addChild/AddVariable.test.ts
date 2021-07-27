import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import {
  Component,
  Model,
  Parser,
  Printer,
} from "../../../src/types/ILibcellml";
import { Elements } from "../../../src/types/Elements";
import { ChildVariableDetail } from "../../../src/types/ChildDetail";
import { AddVariable } from "../../../src/backend/addChild/AddVariable";

describe("Adding Variable to Component", function () {
  this.timeout(5000);
  it("Add basic variable", async () => {
    const fm = new FileManagement();
    await fm.init();

    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");
    const c1: Component = new fm._cellml.Component();
    c1.setName("c1");
    m.addComponent(c1);

    // Assigning model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(c1, Elements.component);

    // Applying update
    const child: ChildVariableDetail = {
      type: Elements.variable,
      attribute: {
        name: "v1",
        varInterface: "none",
        initialValue: null,
        units: "second",
      },
    };

    AddVariable(fm, child);

    // Validation
    const updatedContent = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const newModel = parser.parseModel(updatedContent);

    assert.strictEqual(newModel.componentByIndex(0).variableCount(), 1);
    assert.strictEqual(
      newModel.componentByIndex(0).variableByIndex(0).name(),
      "v1"
    );
    assert.strictEqual(
      newModel.componentByIndex(0).variableByIndex(0).units().name(),
      "second"
    );
  });

  it("Add complex variable", async () => {
    const fm = new FileManagement();
    await fm.init();

    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");
    const c1: Component = new fm._cellml.Component();
    c1.setName("c1");
    m.addComponent(c1);

    // Assigning model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(c1, Elements.component);

    // Applying update
    const child: ChildVariableDetail = {
      type: Elements.variable,
      attribute: {
        name: "v1",
        varInterface: "public",
        initialValue: "5000",
        units: "second",
      },
    };

    AddVariable(fm, child);

    // Validation
    const updatedContent = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const newModel = parser.parseModel(updatedContent);

    assert.strictEqual(newModel.componentByIndex(0).variableCount(), 1);
    assert.strictEqual(
      newModel.componentByIndex(0).variableByIndex(0).name(),
      "v1"
    );
    assert.strictEqual(
      newModel.componentByIndex(0).variableByIndex(0).units().name(),
      "second"
    );
    assert.strictEqual(
      newModel.componentByIndex(0).variableByIndex(0).interfaceType(),
      "public"
    );
    assert.strictEqual(
      newModel.componentByIndex(0).variableByIndex(0).initialValue(),
      "5000"
    );
  });
});
