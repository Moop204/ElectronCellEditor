import assert from "assert";
import FileManagement from "../../../src/backend/FileManagement";
import { Elements } from "../../../src/types/Elements";
import { Component, Model, Variable } from "../../../src/types/ILibcellml";
import { IUpdate } from "../../../src/types/IQuery";

describe("Updating Units attribute", function () {
  this.timeout(5000);
  let fm: FileManagement;
  const newName = "second";
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
  });

  it("Updating a Variable with standard Units", async () => {
    const m: Model = new fm._cellml.Model();
    m.setName("model");
    const c: Component = new fm._cellml.Component();
    c.setName("c1");
    const v: Variable = new fm._cellml.Variable();
    v.setName("v1");
    v.setUnitsByName("joules");

    c.addVariable(v);
    m.addComponent(c);

    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(v, Elements.variable);

    const update: IUpdate = {
      element: Elements.variable,
      select: {
        name: "v1",
        index: null,
      },
      attribute: "units",
      value: newName,
    };

    fm.update([update], fm.getContent(), fm);

    const newCurrentElement = fm.getCurrentComponent();
    const newModel = fm._parser.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Variable).units().name(),
      newName,
      "Current selection name not changed."
    );

    assert.strictEqual(
      (newModel as Model).componentByIndex(0).variableByIndex(0).units().name(),
      newName,
      "Model name not changed."
    );
  });
});
