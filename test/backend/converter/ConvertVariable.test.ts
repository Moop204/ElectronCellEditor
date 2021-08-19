import { Elements } from "../../../src/types/Elements";
import { Component, Model, Variable } from "../../../src/types/ILibcellml";
import FileManagement from "../../../src/backend/FileManagement";
import { convertSelectedElement } from "../../../src/backend/converter/convertElement";
import assert from "assert";

describe("Converting CellML Variables into property format", function () {
  this.timeout(5000);
  let fm: FileManagement;

  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
  });

  it("Converting barest Variable", async () => {
    const processor = fm._processor;
    const v: Variable = processor.buildVariable("v1", "second");
    const convertedElement = convertSelectedElement(Elements.variable, v, fm);

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.variable);
    assert.ok(convertedElement.attribute["name"]);
    assert.strictEqual(convertedElement.attribute["name"], "v1");
    assert.ok(convertedElement.attribute["units"]);
    assert.strictEqual(convertedElement.attribute["units"], "second");
    // Check children
    assert.strictEqual(convertedElement.unit.length, 0);
  });
  it("Converting Variable with interface", async () => {
    const processor = fm._processor;
    const v: Variable = processor.buildVariable("v1", "second", "public");
    const convertedElement = convertSelectedElement(Elements.variable, v, fm);

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.variable);
    assert.ok(convertedElement.attribute["name"]);
    assert.strictEqual(convertedElement.attribute["name"], "v1");
    assert.ok(convertedElement.attribute["units"]);
    assert.strictEqual(convertedElement.attribute["units"], "second");
    assert.ok(convertedElement.attribute["interfaceType"]);
    assert.strictEqual(convertedElement.attribute["interfaceType"], "public");
    // Check children
    assert.strictEqual(convertedElement.unit.length, 0);
  });
  it("Converting Variable with initial value", async () => {
    const processor = fm._processor;
    const v: Variable = processor.buildVariable("v1", "second", "", "245");
    const convertedElement = convertSelectedElement(Elements.variable, v, fm);

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.variable);
    assert.ok(convertedElement.attribute["name"]);
    assert.strictEqual(convertedElement.attribute["name"], "v1");
    assert.ok(convertedElement.attribute["units"]);
    assert.strictEqual(convertedElement.attribute["units"], "second");
    assert.ok(convertedElement.attribute["initialValue"]);
    assert.strictEqual(convertedElement.attribute["initialValue"], "245");
    // Check children
    assert.strictEqual(convertedElement.unit.length, 0);
  });
});
