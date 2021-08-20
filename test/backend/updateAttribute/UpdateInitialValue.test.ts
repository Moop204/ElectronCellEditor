import assert from "assert";
import FileManagement from "../../../src/backend/FileManagement";
import { Elements } from "../../../src/types/Elements";
import { Model, Variable } from "../../../src/types/ILibcellml";
import { IUpdate } from "../../../src/types/IQuery";

describe("Updating initial value attribute", function () {
  this.timeout(5000);
  let fm: FileManagement;
  const newValue = "100";
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();

    const processor = fm._processor;
    const m = processor.buildModel("model");
    const c1 = processor.buildComponent("c1");
    const v1 = processor.buildVariable("v1", "second");

    processor.addComponent(m, c1);
    processor.addVariable(c1, v1);

    fm.updateContentFromModel(m);
    fm.setCurrent(v1, Elements.variable);
  });

  it("Updating initial value with a number", async () => {
    const update: IUpdate = {
      element: Elements.variable,
      select: {
        name: "v1",
        index: 0,
      },
      attribute: "initialValue",
      value: newValue,
    };

    fm.update([update], fm.getContent(), fm);

    const newCurrentElement = fm.getCurrent();
    const newModel = fm.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Variable).initialValue(),
      newValue,
      "Current selection name not changed."
    );
    assert.strictEqual(
      (newModel as Model).componentByIndex(0).variableByIndex(0).initialValue(),
      newValue,
      "Model name not changed."
    );
  });
});
