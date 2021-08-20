import { Elements } from "../../../src/types/Elements";
import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { removeConnection } from "../../../src/backend/removeChild/removeConnection";
import { ensureValid } from "../../../src/utility/ensureValid";

describe("Removing CellML Connection", function () {
  this.timeout(5000);
  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();

    const processor = fm._processor;
    const m = processor.buildModel("model");
    const c1 = processor.buildComponent("c1");
    const c2 = processor.buildComponent("c2");
    const v1 = processor.buildVariable("v1", "second", "public");
    const v2 = processor.buildVariable("v2", "second", "public");
    const mathValue =
      `<math xmlns="http://www.w3.org/1998/Math/MathML"><ci>v1</ci></math>`.trim();
    const r = processor.buildReset(v1, v2, 1, mathValue, mathValue);
    processor.addVariable(c2, v2);
    processor.addVariable(c1, v1);
    processor.addReset(c1, r);
    processor.addComponent(m, c1);
    processor.addComponent(m, c2);
    processor.addEquivalence(v1, v2, "id_map", "id_connect");

    fm.updateContentFromModel(m);
    fm.setCurrent(v1, Elements.variable);
  });

  it("Removing Connection between two Variables", async () => {
    removeConnection(fm, { name: null, index: 0 });

    const updatedContent = fm.getContent();
    const newModel = fm.parseModel(updatedContent);
    const newV1 = newModel.componentByIndex(0).variableByIndex(0);
    const newV2 = newModel.componentByIndex(1).variableByIndex(0);
    assert.ok(ensureValid(fm), "Resulting CellML file is invalid");
    assert.strictEqual(
      newV1.equivalentVariableCount(),
      0,
      "Connection remains"
    );
    assert.strictEqual(
      newV2.equivalentVariableCount(),
      0,
      "Connection remains"
    );
    assert.strictEqual(fm._model.getType(), Elements.variable);
    assert.ok(fm._processor.matchElement(fm.getCurrent(), Elements.variable));
  });
});
