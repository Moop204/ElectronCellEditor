import assert from "assert";
import FileManagement from "../../../src/backend/FileManagement";
import { Elements } from "../../../src/types/Elements";
import {
  Component,
  Model,
  Reset,
  Variable,
} from "../../../src/types/ILibcellml";
import { IUpdate } from "../../../src/types/IQuery";

describe("Updating Reset attribute reset_value", function () {
  this.timeout(5000);
  let fm: FileManagement;
  const newValue = "v2";
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

  it("updates", async () => {
    const update: IUpdate = {
      element: Elements.reset,
      select: {
        name: "c1",
        index: 0,
      },
      attribute: "variable",
      value: newValue,
    };

    fm.update([update], fm.getContent(), fm);

    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Reset).variable().name(),
      newValue,
      "Current selection name not changed."
    );
    assert.strictEqual(
      (newModel as Model).componentByIndex(0).reset(0).variable().name(),
      newValue,
      "Model name not changed."
    );
  });
});
