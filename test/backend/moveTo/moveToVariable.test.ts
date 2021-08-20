import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { Variable } from "../../../src/types/ILibcellml";
import { Elements } from "../../../src/types/Elements";
import { moveTo } from "../../../src/backend/moveTo/moveTo";
import { IDirectSelect } from "../../../src/types/IQuery";

describe("Move to Variable in model", function () {
  this.timeout(5000);

  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
    // Building model
    const processor = fm._processor;
    const m = processor.buildModel("test_model");
    const c1 = processor.buildComponent("c1");
    const v1 = processor.buildVariable("v1", "joules");

    processor.addComponent(m, c1);
    processor.addVariable(c1, v1);

    fm.updateContentFromModel(m);
    fm.setCurrent(m, Elements.model);
  });

  afterEach(async () => {
    fm.newFile();
  });

  it("Moves to Variable", async () => {
    // Applying update
    const move: IDirectSelect = {
      element: Elements.variable,
      select: {
        index: 0,
        name: "v1",
      },
      parent: "c1",
    };

    moveTo(move, fm);

    const cur = fm.getCurrent() as Variable;
    assert.strictEqual(cur.name(), "v1");
    assert.strictEqual(fm._model.getType(), Elements.variable);
    assert.ok(fm._processor.matchElement(fm.getCurrent(), Elements.variable));
  });
});
