import assert from "assert";
import FileManagement from "../../../src/backend/FileManagement";
import { Elements } from "../../../src/types/Elements";
import { Model, Units } from "../../../src/types/ILibcellml";
import { IUpdate } from "../../../src/types/IQuery";

describe("Updating multiplier attribute", function () {
  this.timeout(5000);
  let fm: FileManagement;
  const newValue = 50;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();

    const processor = fm._processor;
    const m = processor.buildModel("model");
    const u1 = processor.buildUnits("u1");

    processor.addUnits(m, u1);

    fm.updateContentFromModel(m);
    fm.setCurrent(u1, Elements.units);
  });

  it("Updating multiplier with a number", async () => {
    const update: IUpdate = {
      element: Elements.units,
      select: {
        name: "u1",
        index: 0,
      },
      attribute: "multiplier",
      value: newValue,
    };

    fm.update([update], fm.getContent(), fm);

    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Units).unitAttributeMultiplier(0),
      newValue,
      "Current selection name not changed."
    );
    assert.strictEqual(
      (newModel as Model).unitsByIndex(0).unitAttributeMultiplier(0),
      newValue,
      "Model name not changed."
    );
  });
});
