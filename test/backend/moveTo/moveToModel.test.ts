import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { Model } from "../../../src/types/ILibcellml";
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
    fm.updateContentFromModel(m);
    fm.setCurrent(c1, Elements.component);
  });

  afterEach(async () => {
    fm.newFile();
  });

  it("Moves to local component", async () => {
    // Applying update
    const move: IDirectSelect = {
      element: Elements.model,
      select: {
        index: 0,
        name: "test_model",
      },
      parent: "",
    };

    moveTo(move, fm);

    const cur = fm.getCurrent() as Model;
    assert.strictEqual(cur.name(), "test_model");
    assert.strictEqual(fm._model.getType(), Elements.model);
  });
});
