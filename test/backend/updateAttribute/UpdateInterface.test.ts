import assert from "assert";
import { CellmlProcessor } from "../../../src/backend/CellmlProcessor";
import FileManagement from "../../../src/backend/FileManagement";
import { CellmlModel } from "../../../src/backend/model/CellmlModel";
import { Elements, elmToStr } from "../../../src/types/Elements";
import { Component, Model, Variable } from "../../../src/types/ILibcellml";
import { IUpdate } from "../../../src/types/IQuery";

describe("Updating interface attribute", function () {
  this.timeout(5000);
  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
    const modeller: CellmlProcessor = fm._processor;

    const m: Model = modeller.buildModel("model");
    const c: Component = modeller.buildComponent("c1");

    const v: Variable = modeller.buildVariable("v1", "second");
    modeller.addVariable(c, v);
    modeller.addComponent(m, c);

    fm.updateContentFromModel(m);
    fm.setCurrent(v, Elements.variable);
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
    console.log("PRE UPDATE" + elmToStr(fm._model.getType()));
    fm.update([update], fm.getContent(), fm);
    console.log("POST UDATE" + elmToStr(fm._model.getType()));

    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());
    console.log("END " + elmToStr(fm._model.getType()));

    console.log(newCurrentElement);
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

    fm.update([update], fm.getContent(), fm);
    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());
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

    fm.update([update], fm.getContent(), fm);
    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());
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
