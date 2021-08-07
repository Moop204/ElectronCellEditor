import { Elements } from "../../../src/types/Elements";
import { Model, Units } from "../../../src/types/ILibcellml";
import FileManagement from "../../../src/backend/FileManagement";
import { convertSelectedElement } from "../../../src/backend/converter/convertElement";
import assert from "assert";

describe("Converting CellML Units into property format", function () {
  this.timeout(5000);
  let fm: FileManagement;

  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
  });
  it("Converting barest Units", async () => {
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const units: Units = new fm._cellml.Units();
    units.setName("testUnit1");
    m.addUnits(units);
    // Give model to converter
    const convertedElement = convertSelectedElement(Elements.units, units, fm);

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.units);
    assert.strictEqual(Object.keys(convertedElement.attribute).length, 1);
    assert.ok(convertedElement.attribute["name"]);
    assert.strictEqual(convertedElement.attribute["name"], "testUnit1");
    // Check children
    assert.strictEqual(convertedElement.unit.length, 0);
  });
  it("Converting Units with Unit", async () => {
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const units: Units = new fm._cellml.Units();
    units.setName("testUnit1");
    units.addUnitByReference("second");
    m.addUnits(units);
    // Give model to converter
    const convertedElement = convertSelectedElement(Elements.units, units, fm);

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.units);
    assert.strictEqual(Object.keys(convertedElement.attribute).length, 1);
    assert.ok(convertedElement.attribute["name"]);
    assert.strictEqual(convertedElement.attribute["name"], "testUnit1");
    // Check children
    assert.strictEqual(convertedElement.unit.length, 1);
    assert.strictEqual(
      convertedElement.unit[0].description.reference,
      "second"
    );
    assert.strictEqual(convertedElement.unit[0].description.imported, "");
    assert.strictEqual(convertedElement.unit[0].description.prefix, "");
    assert.strictEqual(convertedElement.unit[0].description.exponent, 1);
    assert.strictEqual(convertedElement.unit[0].description.multiplier, 1);
  });
  it("Converting Units with Unit and exponent, prefixes and multipliers", async () => {
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const units: Units = new fm._cellml.Units();
    units.setName("testUnit1");
    units.addUnitByReferenceStringPrefix("second", "milli", 1, -1000, "");
    m.addUnits(units);
    // Give model to converter
    const convertedElement = convertSelectedElement(Elements.units, units, fm);

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.units);
    assert.strictEqual(Object.keys(convertedElement.attribute).length, 1);
    assert.ok(convertedElement.attribute["name"]);
    assert.strictEqual(convertedElement.attribute["name"], "testUnit1");
    // Check children
    assert.strictEqual(convertedElement.unit.length, 1);
    assert.strictEqual(
      convertedElement.unit[0].description.reference,
      "second"
    );
    assert.strictEqual(convertedElement.unit[0].description.imported, "");
    assert.strictEqual(convertedElement.unit[0].description.prefix, "milli");
    assert.strictEqual(convertedElement.unit[0].description.exponent, 1);
    assert.strictEqual(convertedElement.unit[0].description.multiplier, -1000);
  });

  it("Converting Units with Unit and exponents", async () => {
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const units: Units = new fm._cellml.Units();
    units.setName("testUnit1");
    units.addUnitByReferenceExponent("second", 12, "");
    m.addUnits(units);
    // Give model to converter
    const convertedElement = convertSelectedElement(Elements.units, units, fm);

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.units);
    assert.ok(convertedElement.attribute["name"]);
    assert.strictEqual(convertedElement.attribute["name"], "testUnit1");
    // Check children
    assert.strictEqual(convertedElement.unit.length, 1);
    assert.strictEqual(
      convertedElement.unit[0].description.reference,
      "second"
    );
    assert.strictEqual(convertedElement.unit[0].description.imported, "");
    assert.strictEqual(convertedElement.unit[0].description.prefix, "");
    assert.strictEqual(convertedElement.unit[0].description.exponent, 12);
    assert.strictEqual(convertedElement.unit[0].description.multiplier, 1);
  });

  it("Converting Units with imported Unit", async () => {
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const units: Units = new fm._cellml.Units();
    units.setName("testUnit1");
    m.addUnits(units);
    // Give model to converter
    const convertedElement = convertSelectedElement(Elements.units, units, fm);

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.units);
    assert.ok(convertedElement.attribute["name"]);
    assert.strictEqual(convertedElement.attribute["name"], "testUnit1");
    // Check children
    assert.strictEqual(convertedElement.unit.length, 0);
  });

  it("Converting Units with multiple Unit", async () => {
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");

    const units: Units = new fm._cellml.Units();
    units.setName("testUnit1");
    units.addUnitByReferenceExponent("second", 12, "");
    units.addUnitByReferenceStringPrefix("second", "milli", 1, -1000, "");

    m.addUnits(units);
    // Give model to converter
    const convertedElement = convertSelectedElement(Elements.units, units, fm);

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.units);
    assert.ok(convertedElement.attribute["name"]);
    assert.strictEqual(convertedElement.attribute["name"], "testUnit1");
    // Check children
    assert.strictEqual(convertedElement.unit.length, 2);
    assert.strictEqual(
      convertedElement.unit[0].description.reference,
      "second"
    );
    assert.strictEqual(convertedElement.unit[0].description.imported, "");
    assert.strictEqual(convertedElement.unit[0].description.prefix, "");
    assert.strictEqual(convertedElement.unit[0].description.exponent, 12);
    assert.strictEqual(convertedElement.unit[0].description.multiplier, 1);
    assert.strictEqual(
      convertedElement.unit[1].description.reference,
      "second"
    );
    assert.strictEqual(convertedElement.unit[1].description.imported, "");
    assert.strictEqual(convertedElement.unit[1].description.prefix, "milli");
    assert.strictEqual(convertedElement.unit[1].description.exponent, 1);
    assert.strictEqual(convertedElement.unit[1].description.multiplier, -1000);
  });
});
