import assert from "assert";
import FileManagement from "../../../src/backend/FileManagement";
import { Elements } from "../../../src/types/Elements";
import { Component, Model, Variable } from "../../../src/types/ILibcellml";
import { IUpdate } from "../../../src/types/IQuery";

describe("Updating name attribute", function () {
  this.timeout(5000);
  let fm: FileManagement;
  const newName = "new_name";
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();

    const processor = fm._processor;
    const m = processor.buildModel("model");
    const c1 = processor.buildComponent("c1");
    const u1 = processor.buildUnits("u1");
    const v1 = processor.buildVariable("v1", "joules");

    processor.addComponent(m, c1);
    processor.addUnits(m, u1);
    processor.addVariable(c1, v1);

    fm.updateContentFromModel(m);
    fm.setCurrent(m, Elements.model);
  });

  it("Updating a model", async () => {
    const update: IUpdate = {
      element: Elements.model,
      select: {
        name: "model",
        index: null,
      },
      attribute: "name",
      value: newName,
    };

    fm.update([update], fm.getContent(), fm);

    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Model).name(),
      newName,
      "Current selection name not changed."
    );
    assert.strictEqual(
      (newModel as Model).name(),
      newName,
      "Model name not changed."
    );
  });

  it("Updating a component", async () => {
    const m = fm.getCurrent() as Model;
    fm.setCurrent(m.componentByName("c1", true), Elements.component);

    const update: IUpdate = {
      element: Elements.component,
      select: {
        name: "c1",
        index: null,
      },
      attribute: "name",
      value: newName,
    };

    fm.update([update], fm.getContent(), fm);

    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Component).name(),
      newName,
      "Current selection name not changed."
    );
    assert.strictEqual(
      (newModel as Model).componentByIndex(0).name(),
      newName,
      "Model name not changed."
    );
  });
  it("Updating a units", async () => {
    const m = fm.getCurrent() as Model;
    fm.setCurrent(m.unitsByName("u1"), Elements.units);

    const update: IUpdate = {
      element: Elements.units,
      select: {
        name: "u1",
        index: null,
      },
      attribute: "name",
      value: newName,
    };

    fm.update([update], fm.getContent(), fm);

    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Component).name(),
      newName,
      "Current selection name not changed."
    );
    assert.strictEqual(
      (newModel as Model).unitsByIndex(0).name(),
      newName,
      "Model name not changed."
    );
  });
  it("Updating a Variable", async () => {
    const m = fm.getCurrent() as Model;
    fm.setCurrent(m.componentByIndex(0).variableByIndex(0), Elements.variable);

    const update: IUpdate = {
      element: Elements.variable,
      select: {
        name: "v1",
        index: null,
      },
      attribute: "name",
      value: newName,
    };

    fm.update([update], fm.getContent(), fm);

    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Variable).name(),
      newName,
      "Current selection name not changed."
    );

    assert.strictEqual(
      (newModel as Model).componentByIndex(0).variableByIndex(0).name(),
      newName,
      "Model name not changed."
    );
  });
});
