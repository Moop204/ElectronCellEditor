import assert from "assert";
import { convertSelectedElement } from "../../../src/backend/converter/convertElement";
import FileManagement from "../../../src/backend/FileManagement";
import { Elements } from "../../../src/types/Elements";
import { Model, Units, Component } from "../../../src/types/ILibcellml";

describe("Converting CellML Model into property format", function () {
  this.timeout(5000);
  let fm: FileManagement;

  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
  });

  it("Converting Empty Model", async () => {
    const m: Model = new fm._cellml.Model();
    m.setName("test");

    // Give model to converter
    const convertedModel = convertSelectedElement(Elements.model, m, fm);

    // Check attributes of model are preserved
    assert.strictEqual(convertedModel.type, Elements.model);
    assert.strictEqual(Object.keys(convertedModel.attribute).length, 1);
    assert.ok(convertedModel.attribute["name"]);
    // A child for each child-type
    assert.strictEqual(Object.keys(convertedModel.children).length, 2);
    assert.strictEqual(convertedModel.children["component"].length, 0);
    assert.strictEqual(convertedModel.children["units"].length, 0);
  });

  it("Converting a Model with children", async () => {
    const m: Model = new fm._cellml.Model();
    m.setName("test");
    const c: Component = new fm._cellml.Component();
    c.setName("test_component");
    const u: Units = new fm._cellml.Units();
    u.setName("test_units");
    m.addComponent(c);
    m.addUnits(u);

    // Give model to converter
    const convertedModel = convertSelectedElement(Elements.model, m, fm);
    // Check attributes of model are preserved
    assert.strictEqual(convertedModel.type, Elements.model);
    assert.strictEqual(Object.keys(convertedModel.attribute).length, 1);
    assert.strictEqual(convertedModel.attribute["name"], "test");
    // A child for each child-type
    assert.strictEqual(Object.keys(convertedModel.children).length, 2);
    assert.strictEqual(convertedModel.children["component"].length, 1);
    assert.strictEqual(convertedModel.children["units"].length, 1);
  });
});
