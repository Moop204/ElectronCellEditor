import assert from "assert";
import FileManagement from "../../../src/backend/FileManagement";
import { Elements } from "../../../src/types/Elements";
import { Model, Reset } from "../../../src/types/ILibcellml";
import { IUpdate } from "../../../src/types/IQuery";

describe("Updating Reset attribute Order", function () {
  this.timeout(5000);
  let fm: FileManagement;
  const newValue = "3";
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();

    const processor = fm._processor;
    const m = processor.buildModel("model");
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

  it("Updating with a number", async () => {
    const update: IUpdate = {
      element: Elements.reset,
      select: {
        name: "c1",
        index: 0,
      },
      attribute: "order",
      value: newValue,
    };

    fm.update([update], fm.getContent(), fm);

    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());

    assert.strictEqual((newCurrentElement as Reset).order(), 3);
    assert.strictEqual(
      (newModel as Model).componentByIndex(0).reset(0).order(),
      3
    );
  });
});
