import assert from "assert";
import FileManagement from "../../../src/backend/FileManagement";
import { updateOrder } from "../../../src/backend/updateAttribute/updateOrder";
import {
  Component,
  Model,
  Reset,
  Variable,
} from "../../../src/types/ILibcellml";

describe("Updating Reset attribute Order", function () {
  this.timeout(5000);
  let fm: FileManagement;

  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
  });

  it("Updating with a number", async () => {
    const fm = new FileManagement();
    await fm.init();

    const m: Model = new fm._cellml.Model();
    m.setName("model");
    const c1: Component = new fm._cellml.Component();
    c1.setName("c1");
    const v1: Variable = new fm._cellml.Variable();
    v1.setName("v1");
    v1.setUnitsByName("second");
    const r: Reset = new fm._cellml.Reset();
    r.setOrder(1);
    const mathValue =
      `<math xmlns="http://www.w3.org/1998/Math/MathML"><ci>v1</ci></math>`.trim();
    r.setResetValue(mathValue);
    r.setTestValue(mathValue);
    r.setTestVariable(v1);
    r.setVariable(v1);

    c1.addVariable(v1);
    c1.addReset(r);
    m.addComponent(c1);

    const { newModel, newCurrentElement } = updateOrder(m, r, "3", {
      name: "c1",
      index: 0,
    });

    assert.strictEqual((newCurrentElement as Reset).order(), 3);
    assert.strictEqual(
      (newModel as Model).componentByIndex(0).reset(0).order(),
      3
    );
  });
});
