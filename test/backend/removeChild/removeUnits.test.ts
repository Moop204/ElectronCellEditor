import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { IChild } from "../../../src/types/IProperties";
import { removeUnits } from "../../../src/backend/removeChild/removeUnits";
import { Elements } from "../../../src/types/Elements";

describe("Removing CellML Units in property format", function () {
  this.timeout(5000);
  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();

    const processor = fm._processor;
    const m = processor.buildModel("testModel");
    const u1 = processor.buildUnits("u1");

    processor.addUnits(m, u1);

    fm.updateContentFromModel(m);
    fm.setCurrent(m, Elements.model);
  });
  it("Removing Units", async () => {
    const child: IChild = {
      name: "u1",
      index: 0,
    };

    removeUnits(fm, child);

    const postRemoval = fm.getContent();
    const postModel = fm.parseModel(postRemoval);
    // Check attributes of element are preserved
    assert.strictEqual(
      postModel.unitsCount(),
      0,
      "No Units remain after removing only variable."
    );
    // Check children
    assert.ok(
      fm._processor.matchElement(fm.getCurrent(), Elements.model),
      "Current element remains the same"
    );
  });
});
