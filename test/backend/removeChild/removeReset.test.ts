import { Elements } from "../../../src/types/Elements";
import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { IChild } from "../../../src/types/IProperties";
import { removeReset } from "../../../src/backend/removeChild/removeReset";

describe("Removing CellML Reset into property format", function () {
  this.timeout(5000);
  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();

    const processor = fm._processor;
    const m = processor.buildModel("testModel");
    const c1 = processor.buildComponent("c1");
    const v1 = processor.buildVariable("v1", "kelvin");
    const mathValue =
      `<math xmlns="http://www.w3.org/1998/Math/MathML"><ci>v1</ci></math>`.trim();
    const r = processor.buildReset(v1, v1, 1, mathValue, mathValue);

    processor.addComponent(m, c1);
    processor.addVariable(c1, v1);
    processor.addReset(c1, r);

    fm.updateContentFromModel(m);
    fm.setCurrent(c1, Elements.component);
  });

  it("Removing Reset", async () => {
    const child: IChild = {
      name: "v1",
      index: 0,
    };

    removeReset(fm, child);

    const postRemoval = fm.getContent();
    const postModel = fm.parseModel(postRemoval);
    // Check attributes of element are preserved
    assert.strictEqual(
      postModel.componentByIndex(0).resetCount(),
      0,
      "No variables remain after removing only variable."
    );
    // Check children
    assert.ok(
      (fm.getCurrent(), Elements.component),
      "Current element remains the same"
    );
  });
});
