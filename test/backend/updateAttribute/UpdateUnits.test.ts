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

    const processor = fm._processor;
    const m = processor.buildModel("model");
    const c = processor.buildComponent("c1");
    const v = processor.buildVariable("v1", "joules");

    processor.addVariable(c, v);
    processor.addComponent(m, c);
    fm.updateContentFromModel(m);
    fm.setCurrent(v, Elements.variable);
  });

  it("Updating a Variable with standard Units", async () => {
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

    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());
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
