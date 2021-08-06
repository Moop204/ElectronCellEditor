import assert from "assert";
import FileManagement from "../../../src/backend/FileManagement";
import { Elements } from "../../../src/types/Elements";
import {
  Component,
  Model,
  Reset,
  Variable,
} from "../../../src/types/ILibcellml";
import { IUpdate } from "../../../src/types/IQuery";

describe("Updating Reset attribute reset_value", function () {
  this.timeout(5000);
  let fm: FileManagement;
  const newValue =
    `<math xmlns="http://www.w3.org/1998/Math/MathML" xmlns:cellml="http://www.cellml.org/cellml/2.0#">
  <apply><eq/>
    <ci>v1</ci>
    <apply><times/>
      <cn cellml:units="dimensionless">2</cn>
      <cn cellml:units="dimensionless">2</cn>
    </apply>
  </apply></math>`
      .replace(/\n/g, "")
      .replace(/> *</g, "><");

  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
  });

  it("updates", async () => {
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

    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(r, Elements.reset);

    const update: IUpdate = {
      element: Elements.reset,
      select: {
        name: "c1",
        index: 0,
      },
      attribute: "reset_value",
      value: newValue,
    };

    fm.update([update], fm.getContent(), fm.getCurrentComponent(), fm);

    const newCurrentElement = fm.getCurrentComponent();
    const newModel = fm._parser.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Reset).resetValue().trim(),
      newValue.trim(),
      "Current selection name not changed."
    );
    assert.strictEqual(
      (newModel as Model).componentByIndex(0).reset(0).resetValue().trim(),
      newValue.trim(),
      "Model name not changed."
    );
  });
});
