import { Elements } from "../../../src/types/Elements";
import {
  Component,
  Model,
  Reset,
  Variable,
} from "../../../src/types/ILibcellml";
import FileManagement from "../../../src/backend/FileManagement";
import { convertSelectedElement } from "../../../src/backend/converter/ConvertElement";
import assert from "assert";

describe("Converting CellML Reset into property format", function () {
  this.timeout(5000);
  it("Converting Reset", async () => {
    const fm = new FileManagement();
    await fm.init();
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const component: Component = new fm._cellml.Component();
    component.setName("c1");
    const v: Variable = new fm._cellml.Variable();
    v.setName("v1");
    v.setUnitsByName("second");
    const r: Reset = new fm._cellml.Reset();
    r.setOrder(1);
    const mathValue =
      `<math xmlns="http://www.w3.org/1998/Math/MathML"><ci>v1</ci></math>`.trim();
    r.setResetValue(mathValue);
    r.setTestValue(mathValue);
    r.setTestVariable(v);
    r.setVariable(v);

    const convertedElement = convertSelectedElement(Elements.reset, r, fm);

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.reset);
    assert.ok(convertedElement.attribute["variable"]);
    assert.strictEqual(convertedElement.attribute["variable"], "v1");
    assert.ok(convertedElement.attribute["test_variable"]);
    assert.strictEqual(convertedElement.attribute["test_variable"], "v1");
    assert.ok(convertedElement.attribute["order"]);
    assert.strictEqual(convertedElement.attribute["order"], 1);
    assert.ok(convertedElement.attribute["reset_value"]);
    assert.strictEqual(convertedElement.attribute["reset_value"], mathValue);
    assert.ok(convertedElement.attribute["test_value"]);
    assert.strictEqual(convertedElement.attribute["test_value"], mathValue);

    // Check children
    assert.strictEqual(convertedElement.unit.length, 0);
  });
});
