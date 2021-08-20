import { Elements } from "../../../src/types/Elements";
import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { IChild } from "../../../src/types/IProperties";
import { removeVariable } from "../../../src/backend/removeChild/removeVariable";

describe("Removing CellML Variable into property format", function () {
  this.timeout(5000);
  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();

    const processor = fm._processor;
    const m = processor.buildModel("testModel");
    const c = processor.buildComponent("c1");
    const v = processor.buildVariable("v1", "kelvin");

    processor.addVariable(c, v);
    processor.addComponent(m, c);
    fm.updateContentFromModel(m);
    fm.setCurrent(c, Elements.component);
  });

  it("Removing Variable", async () => {
    const child: IChild = {
      name: "v1",
      index: 0,
    };

    removeVariable(fm, child);

    const postRemoval = fm.getContent();
    const postModel = fm.parseModel(postRemoval);
    // Check attributes of element are preserved
    assert.strictEqual(
      postModel.componentByIndex(0).variableCount(),
      0,
      "No variables remain after removing only variable."
    );
    // Check children

    assert.ok(
      fm._processor.matchElement(fm.getCurrent(), Elements.component),
      "Current element remains the same"
    );
  });
});
