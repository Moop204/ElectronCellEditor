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
import { removeConnection } from "../../../src/backend/removeChild/removeConnection";
import { ensureValid } from "../../../src/utility/ensureValid";

describe("Removing CellML Connection", function () {
  this.timeout(5000);
  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
  });

  it("Removing Connection between two Variables", async () => {
    const m: Model = new fm._cellml.Model();
    m.setName("model");
    const c1: Component = new fm._cellml.Component();
    c1.setName("c1");
    const c2: Component = new fm._cellml.Component();
    c2.setName("c2");
    const v1: Variable = new fm._cellml.Variable();
    v1.setName("v1");
    v1.setUnitsByName("second");
    v1.setInterfaceTypeByString("public");
    const v2: Variable = new fm._cellml.Variable();
    v2.setName("v2");
    v2.setUnitsByName("second");
    v2.setInterfaceTypeByString("public");

    c1.addVariable(v1);
    c2.addVariable(v2);
    m.addComponent(c1);
    m.addComponent(c2);

    const commandVar: Variable = fm._cellml.Variable;
    commandVar.addEquivalenceWithIds(v1, v2, "id_map", "id_connect");

    // commandVar.removeEquivalence(v1, v2);

    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(v1, Elements.variable);

    removeConnection(fm, { name: null, index: 0 });

    const updatedContent = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const newModel = parser.parseModel(updatedContent);
    const newV1 = newModel.componentByIndex(0).variableByIndex(0);
    const newV2 = newModel.componentByIndex(1).variableByIndex(0);
    assert.ok(ensureValid(fm), "Resulting CellML file is invalid");
    assert.strictEqual(
      newV1.equivalentVariableCount(),
      0,
      "Connection remains"
    );
    assert.strictEqual(
      newV2.equivalentVariableCount(),
      0,
      "Connection remains"
    );
    assert.strictEqual(fm.type, Elements.variable);
    assert.ok(fm.currentComponent instanceof fm._cellml.Variable);
  });
});
