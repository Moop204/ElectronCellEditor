import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { IChild } from "../../../src/types/IProperties";
import { removeUnit } from "../../../src/backend/removeChild/removeUnit";
import { Elements } from "../../../src/types/Elements";

describe("Removing CellML Unit in property format", function () {
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
    fm.setCurrent(u1, Elements.units);
  });

  it("Removing Unit", async () => {
    const child: IChild = {
      name: null,
      index: 0,
    };

    removeUnit(fm, child);

    const postRemoval = fm.getContent();
    const postModel = fm.parseModel(postRemoval);
    // Check attributes of element are preserved
    assert.strictEqual(
      postModel.unitsByIndex(0).unitCount(),
      0,
      "No Unit remain after removing only variable."
    );
    // Check children
    assert.ok(
      (fm.getCurrent(), Elements.units),
      "Current element remains the same"
    );
  });
});
