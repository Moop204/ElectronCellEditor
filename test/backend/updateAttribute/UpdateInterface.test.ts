import assert from "assert";
import FileManagement from "../../../src/backend/FileManagement";
import { Elements } from "../../../src/types/Elements";
import {
  Component,
  Model,
  Units,
  Variable,
} from "../../../src/types/ILibcellml";
import { IUpdate } from "../../../src/types/IQuery";

describe("Updating interface attribute", function () {
  this.timeout(5000);
  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
    const m: Model = new fm._cellml.Model();
    m.setName("model");
    const c: Component = new fm._cellml.Component();
    c.setName("c1");
    const v: Variable = new fm._cellml.Variable();
    v.setName("v1");
    v.setUnitsByName("second");

    c.addVariable(v);
    m.addComponent(c);

    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(v, Elements.variable);
  });

  it("Updating interface with public", async () => {
    const update: IUpdate = {
      element: Elements.variable,
      select: {
        name: "v1",
        index: 0,
      },
      attribute: "interface",
      value: "public",
    };

    fm.update([update], fm.getContent(), fm.getCurrentComponent(), fm);
    const newCurrentElement = fm.getCurrentComponent();
    const newModel = fm._parser.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Variable).interfaceType(),
      "public",
      "Current selection name not changed."
    );
    assert.strictEqual(
      (newModel as Model)
        .componentByIndex(0)
        .variableByIndex(0)
        .interfaceType(),
      "public",
      "Model name not changed."
    );
  });

  it("Updating interface with private", async () => {
    const update: IUpdate = {
      element: Elements.variable,
      select: {
        name: "v1",
        index: 0,
      },
      attribute: "interface",
      value: "private",
    };

    fm.update([update], fm.getContent(), fm.getCurrentComponent(), fm);
    const newCurrentElement = fm.getCurrentComponent();
    const newModel = fm._parser.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Variable).interfaceType(),
      "private",
      "Current selection name not changed."
    );
    assert.strictEqual(
      (newModel as Model)
        .componentByIndex(0)
        .variableByIndex(0)
        .interfaceType(),
      "private",
      "Model name not changed."
    );
  });

  it("Updating interface with public_and_private", async () => {
    const update: IUpdate = {
      element: Elements.variable,
      select: {
        name: "v1",
        index: 0,
      },
      attribute: "interface",
      value: "public_and_private",
    };

    fm.update([update], fm.getContent(), fm.getCurrentComponent(), fm);
    const newCurrentElement = fm.getCurrentComponent();
    const newModel = fm._parser.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Variable).interfaceType(),
      "public_and_private",
      "Current selection name not changed."
    );
    assert.strictEqual(
      (newModel as Model)
        .componentByIndex(0)
        .variableByIndex(0)
        .interfaceType(),
      "public_and_private",
      "Model name not changed."
    );
  });
});
