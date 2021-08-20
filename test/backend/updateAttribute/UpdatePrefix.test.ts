import assert from "assert";
import FileManagement from "../../../src/backend/FileManagement";
import { Elements } from "../../../src/types/Elements";
import { Model, Units } from "../../../src/types/ILibcellml";
import { IUpdate } from "../../../src/types/IQuery";

describe("Updating exponent attribute", function () {
  this.timeout(5000);
  let fm: FileManagement;
  const newValue = "milli";
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();

    const processor = fm._processor;
    const m = processor.buildModel("model");
    const u = processor.buildUnits("u1");

    processor.addUnit(u, "second", undefined, undefined, 12);
    processor.addUnits(m, u);

    fm.updateContentFromModel(m);
    fm.setCurrent(u, Elements.units);
  });

  it("Updating exponent with a prefix name", async () => {
    const update: IUpdate = {
      element: Elements.units,
      select: {
        name: "u1",
        index: 0,
      },
      attribute: "prefix",
      value: newValue,
    };

    fm.update([update], fm.getContent(), fm);

    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Units).unitAttributePrefix(0),
      newValue,
      "Current selection name not changed."
    );
    assert.strictEqual(
      (newModel as Model).unitsByIndex(0).unitAttributePrefix(0),
      newValue,
      "Model name not changed."
    );
  });
});
