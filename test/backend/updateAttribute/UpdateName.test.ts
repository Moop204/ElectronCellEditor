import assert from "assert";
import FileManagement from "../../../src/backend/FileManagement";
import { updateOrder } from "../../../src/backend/updateAttribute/UpdateOrder";
import { Elements } from "../../../src/types/Elements";
import {
  Component,
  Model,
  Reset,
  Units,
  Variable,
} from "../../../src/types/ILibcellml";
import { IUpdate } from "../../../src/types/IQuery";

describe("Updating name attribute", function () {
  this.timeout(5000);
  let fm: FileManagement;
  const newName = "new_name";
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
  });

  it("Updating a model", async () => {
    const m: Model = new fm._cellml.Model();
    m.setName("model");
    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(m, Elements.model);

    const update: IUpdate = {
      element: Elements.model,
      select: {
        name: "model",
        index: null,
      },
      attribute: "name",
      value: newName,
    };

    fm.update([update], fm.getContent(), fm.getCurrentComponent(), fm);

    const newCurrentElement = fm.getCurrentComponent();
    const newModel = fm._parser.parseModel(fm.getContent());
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
    const m: Model = new fm._cellml.Model();
    m.setName("model");
    const c: Component = new fm._cellml.Component();
    c.setName("c1");
    m.addComponent(c);
    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(c, Elements.component);

    const update: IUpdate = {
      element: Elements.component,
      select: {
        name: "c1",
        index: null,
      },
      attribute: "name",
      value: newName,
    };

    fm.update([update], fm.getContent(), fm.getCurrentComponent(), fm);

    const newCurrentElement = fm.getCurrentComponent();
    const newModel = fm._parser.parseModel(fm.getContent());
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
    const m: Model = new fm._cellml.Model();
    m.setName("model");
    const u: Units = new fm._cellml.Units();
    u.setName("u1");
    m.addUnits(u);
    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(u, Elements.component);

    const update: IUpdate = {
      element: Elements.units,
      select: {
        name: "u1",
        index: null,
      },
      attribute: "name",
      value: newName,
    };

    fm.update([update], fm.getContent(), fm.getCurrentComponent(), fm);

    const newCurrentElement = fm.getCurrentComponent();
    const newModel = fm._parser.parseModel(fm.getContent());
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
      attribute: "name",
      value: newName,
    };

    fm.update([update], fm.getContent(), fm.getCurrentComponent(), fm);

    const newCurrentElement = fm.getCurrentComponent();
    const newModel = fm._parser.parseModel(fm.getContent());
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
