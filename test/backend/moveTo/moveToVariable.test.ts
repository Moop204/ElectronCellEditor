import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { Component, Model, Variable } from "../../../src/types/ILibcellml";
import { Elements } from "../../../src/types/Elements";
import { moveTo } from "../../../src/backend/moveTo/moveTo";
import { IMoveTo } from "../../../src/backend/moveTo/interfaces";

describe("Move to Variable in model", function () {
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
    c1.addVariable(v1);
    m.addComponent(c1);
    // Assigning model
    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(m, Elements.model);
  });

  afterEach(async () => {
    fm.newFile();
  });

  it("Moves to Variable", async () => {
    // Applying update
    const move: IMoveTo = {
      element: Elements.variable,
      search: {
        index: 0,
        name: "v1",
      },
      parent: "c1",
    };

    moveTo(move, fm);

    const cur = fm.getCurrentComponent() as Variable;
    assert.strictEqual(cur.name(), "v1");
    assert.strictEqual(fm.type, Elements.variable);
  });
});
