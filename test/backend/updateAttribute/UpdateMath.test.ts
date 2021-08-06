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

describe("Updating Math element", function () {
  this.timeout(5000);
  let fm: FileManagement;
  // const newValue = `<math xmlns="http://www.w3.org/1998/Math/MathML"><apply><eq/>
  //   <cn cellml:units="dimensionless">4<cn/>
  //   <apply><times/>
  //     <cn cellml:units="dimensionless">2<cn/>
  //     <cn cellml:units="dimensionless">2<cn/>
  //   </apply>
  // </apply></math>`;
  const newValue =
    `<math xmlns="http://www.w3.org/1998/Math/MathML"><ci>v1</ci></math>`.trim();

  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
  });

  it("Updating Math of a Component without Math", async () => {
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
    fm.setCurrentComponent(c, Elements.component);
    const update: IUpdate = {
      element: Elements.component,
      select: {
        name: "c1",
        index: 0,
      },
      attribute: "math",
      value: newValue,
    };

    fm.update([update], fm.getContent(), fm.getCurrentComponent(), fm);

    console.log("DOWN HERE");
    console.log(fm.getContent());

    const newCurrentElement = fm.getCurrentComponent();
    const newModel = fm._parser.parseModel(fm.getContent());
    console.log("POST");
    console.log(fm.getContent());

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
    const m: Model = new fm._cellml.Model();
    m.setName("model");
    const c: Component = new fm._cellml.Component();
    c.setMath(`<math xmlns="http://www.w3.org/1998/Math/MathML" xmlns:cellml="http://www.cellml.org/cellml/2.0#">
    <apply><eq/>
      <ci>v1</ci>
      <apply><times/>
        <cn cellml:units="dimensionless">2</cn>
        <cn cellml:units="dimensionless">2</cn>
      </apply>
    </apply></math>`);
    c.setName("c1");
    const v: Variable = new fm._cellml.Variable();
    v.setName("v1");
    v.setUnitsByName("second");

    c.addVariable(v);
    m.addComponent(c);

    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(c, Elements.component);

    const update: IUpdate = {
      element: Elements.component,
      select: {
        name: "c1",
        index: 0,
      },
      attribute: "math",
      value: newValue,
    };

    fm.update([update], fm.getContent(), fm.getCurrentComponent(), fm);

    const newCurrentElement = fm.getCurrentComponent();
    const newModel = fm._parser.parseModel(fm.getContent());
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
