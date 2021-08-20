import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { Component, Model } from "../../../src/types/ILibcellml";
import { Elements } from "../../../src/types/Elements";
import { moveTo } from "../../../src/backend/moveTo/moveTo";
import { IDirectSelect } from "../../../src/types/IQuery";

describe("Move to component in model", function () {
  this.timeout(5000);

  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
    // Building model

    const processor = fm._processor;
    const m = processor.buildModel("test_model");
    const c1 = processor.buildComponent("c1");

    processor.addComponent(m, c1);

    // Assigning model
    fm.updateContentFromModel(m);
    fm.setCurrent(m, Elements.model);
  });

  afterEach(async () => {
    fm.newFile();
  });

  it("Moves to local component", async () => {
    // Applying update
    const move: IDirectSelect = {
      element: Elements.component,
      select: {
        index: 0,
        name: "c1",
      },
      parent: "test_model",
    };

    assert.strictEqual((fm.getCurrent() as Model).name(), "test_model");

    moveTo(move, fm);

    const cur = fm.getCurrent() as Component;
    assert.strictEqual(cur.name(), "c1");
    assert.strictEqual(fm._model.getType(), Elements.component);
  });
});
