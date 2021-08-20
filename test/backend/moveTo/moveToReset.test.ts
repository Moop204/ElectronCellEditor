import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { Reset } from "../../../src/types/ILibcellml";
import { Elements } from "../../../src/types/Elements";
import { moveTo } from "../../../src/backend/moveTo/moveTo";
import { IDirectSelect } from "../../../src/types/IQuery";

describe("Move to Reset in model", function () {
  this.timeout(5000);

  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
    // Building model
    const processor = fm._processor;
    const m = processor.buildModel("testModel");
    const c1 = processor.buildComponent("c1");
    const v1 = processor.buildVariable("v1", "second");
    const v2 = processor.buildVariable("v2", "s2cond");
    const mathValue =
      `<math xmlns="http://www.w3.org/1998/Math/MathML"><ci>v1</ci></math>`.trim();
    const r = processor.buildReset(v1, v2, 1, mathValue, mathValue);
    processor.addVariable(c1, v2);
    processor.addVariable(c1, v1);
    processor.addReset(c1, r);
    processor.addComponent(m, c1);
    fm.updateContentFromModel(m);
    fm.setCurrent(r, Elements.reset);
  });

  afterEach(async () => {
    fm.newFile();
  });

  it("Moves to Reset", async () => {
    // Applying update
    const move: IDirectSelect = {
      element: Elements.reset,
      select: {
        index: 0,
        name: "",
      },
      parent: "c1",
    };

    moveTo(move, fm);

    const cur = fm.getCurrent() as Reset;
    assert.strictEqual(cur.variable().name(), "v1");
    assert.strictEqual(fm._model.getType(), Elements.reset);
  });
});
