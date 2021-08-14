import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { Component, Model } from "../../../src/types/ILibcellml";
import { Elements } from "../../../src/types/Elements";
import { moveTo } from "../../../src/backend/moveTo/moveTo";
import { IMoveTo } from "../../../src/backend/moveTo/interfaces";

describe("Move to component in model", function () {
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
    m.addComponent(c1);
    // Assigning model
    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(c1, Elements.component);
  });

  afterEach(async () => {
    fm.newFile();
  });

  it("Moves to local component", async () => {
    // Applying update
    const move: IMoveTo = {
      element: Elements.model,
      search: {
        index: 0,
        name: "test_model",
      },
      parent: "",
    };

    moveTo(move, fm);

    const cur = fm.getCurrentComponent() as Model;
    assert.strictEqual(cur.name(), "test_model");
  });
});
