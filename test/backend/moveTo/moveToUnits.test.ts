import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import {
  Component,
  Model,
  Units,
  Variable,
} from "../../../src/types/ILibcellml";
import { Elements } from "../../../src/types/Elements";
import { moveTo } from "../../../src/backend/moveTo/moveTo";
import { IMoveTo } from "../../../src/backend/moveTo/interfaces";

describe("Move to Units in model", function () {
  this.timeout(5000);

  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");
    const c1: Component = new fm._cellml.Component();
    c1.setName("c1");
    const v1: Variable = new fm._cellml.Variable();
    v1.setName("v1");
    const u1: Units = new fm._cellml.Units();
    u1.setName("u1");

    c1.addVariable(v1);
    m.addComponent(c1);
    m.addUnits(u1);
    // Assigning model
    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(m, Elements.model);
  });

  afterEach(async () => {
    fm.newFile();
  });

  it("Moves to Units", async () => {
    // Applying update
    const move: IMoveTo = {
      element: Elements.units,
      search: {
        index: 0,
        name: "u1",
      },
      parent: "test_model",
    };

    moveTo(move, fm);

    const cur = fm.getCurrentComponent() as Units;
    assert.strictEqual(cur.name(), "u1");
  });
});
