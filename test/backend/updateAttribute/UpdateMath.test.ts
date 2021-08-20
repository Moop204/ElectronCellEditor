import assert from "assert";
import FileManagement from "../../../src/backend/FileManagement";
import { Elements } from "../../../src/types/Elements";
import { Component, Model, Variable } from "../../../src/types/ILibcellml";
import { IUpdate } from "../../../src/types/IQuery";

describe("Updating Math element", function () {
  this.timeout(5000);
  let fm: FileManagement;
  const newValue =
    `<math xmlns="http://www.w3.org/1998/Math/MathML"><ci>v1</ci></math>`.trim();

  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();

    const processor = fm._processor;
    const m = processor.buildModel("model");
    const c1 = processor.buildComponent("c1");

    const c2 = processor.buildComponent("c2");
    const mathml = `<math xmlns="http://www.w3.org/1998/Math/MathML" xmlns:cellml="http://www.cellml.org/cellml/2.0#">
    <apply><eq/>
      <ci>v1</ci>
      <apply><times/>
        <cn cellml:units="dimensionless">2</cn>
        <cn cellml:units="dimensionless">2</cn>
      </apply>
    </apply></math>`;
    processor.updateMath(c2, mathml);
    processor.addComponent(m, c1);
    processor.addComponent(m, c2);

    fm.updateContentFromModel(m);
    fm.setCurrent(m, Elements.model);
  });

  it("Updating Math of a Component without Math", async () => {
    const m = fm.getCurrent() as Model;
    fm.setCurrent(m.componentByName("c1", true), Elements.component);

    const update: IUpdate = {
      element: Elements.component,
      select: {
        name: "c1",
        index: 0,
      },
      attribute: "math",
      value: newValue,
    };

    fm.update([update], fm.getContent(), fm);

    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());

    assert.strictEqual(
      (newCurrentElement as Component).math(),
      newValue,
      "Current selection name not changed."
    );
    assert.strictEqual(
      "|" + (newModel as Model).componentByIndex(0).math().trim() + "|",
      "|" + newValue + "|",
      "Model name not changed."
    );
  });

  it("Updating Math of a Component with Math", async () => {
    const m = fm.getCurrent() as Model;
    fm.setCurrent(m.componentByName("c2", true), Elements.component);

    const update: IUpdate = {
      element: Elements.component,
      select: {
        name: "c1",
        index: 0,
      },
      attribute: "math",
      value: newValue,
    };

    fm.update([update], fm.getContent(), fm);

    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Component).math().trim(),
      newValue,
      "Current selection name not changed."
    );
    assert.strictEqual(
      (newModel as Model).componentByIndex(0).math().trim(),
      newValue,
      "Model name not changed."
    );
  });
});
