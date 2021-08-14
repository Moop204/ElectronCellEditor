import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import {
  Component,
  Model,
  Reset,
  Units,
  Variable,
} from "../../../src/types/ILibcellml";
import { Elements } from "../../../src/types/Elements";
import { moveTo } from "../../../src/backend/moveTo/moveTo";
import { IMoveTo } from "../../../src/backend/moveTo/interfaces";

describe("Move to Reset in model", function () {
  this.timeout(5000);

  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const c1: Component = new fm._cellml.Component();
    c1.setName("c1");
    const v1: Variable = new fm._cellml.Variable();
    v1.setName("v1");
    v1.setUnitsByName("second");
    const r1: Reset = new fm._cellml.Reset();
    r1.setOrder(1);
    const mathValue =
      `<math xmlns="http://www.w3.org/1998/Math/MathML"><ci>v1</ci></math>`.trim();
    r1.setResetValue(mathValue);
    r1.setTestValue(mathValue);
    r1.setTestVariable(v1);
    r1.setVariable(v1);

    c1.addVariable(v1);
    c1.addReset(r1);
    m.addComponent(c1);
    // Assigning model
    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(m, Elements.model);
  });

  afterEach(async () => {
    fm.newFile();
  });

  it("Moves to Reset", async () => {
    // Applying update
    const move: IMoveTo = {
      element: Elements.reset,
      search: {
        index: 0,
        name: "",
      },
      parent: "c1",
    };

    moveTo(move, fm);

    const cur = fm.getCurrentComponent() as Reset;
    assert.strictEqual(cur.variable().name(), "v1");
    assert.strictEqual(fm.type, Elements.reset);
  });
});
