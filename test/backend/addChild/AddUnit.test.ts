import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { Model, Parser, Printer, Units } from "../../../src/types/ILibcellml";
import { Elements } from "../../../src/types/Elements";
import { ChildUnitDetail } from "../../../src/types/ChildDetail";
import { addUnit } from "../../../src/backend/addChild/addUnit";
import { ensureValid } from "../../../src/utility/ensureValid";

describe("Adding Unit to Units", function () {
  this.timeout(5000);

  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");
    const u: Units = new fm._cellml.Units();
    u.setName("u1");
    m.addUnits(u);
    // Assigning model
    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(u, Elements.units);
  });

  afterEach(async () => {
    fm.newFile();
  });

  it("Adds standard Unit", async () => {
    // Applying update
    const child: ChildUnitDetail = {
      type: Elements.unit,
      attribute: {
        prefix: "milli",
        multiplier: "2",
        exponent: "32",
        units: "second",
      },
    };

    await addUnit(fm, child);

    // Validation
    const newCurrentElement = fm.getCurrentComponent();
    const newModel = fm._parser.parseModel(fm.getContent());

    assert.strictEqual(newModel.unitsByIndex(0).unitCount(), 1);
    assert.strictEqual(newModel.unitsByIndex(0).unitAttributeExponent(0), 32);
    assert.strictEqual(newModel.unitsByIndex(0).unitAttributeMultiplier(0), 2);
    assert.strictEqual(
      newModel.unitsByIndex(0).unitAttributeReference(0),
      "second"
    );
    assert.strictEqual(
      newModel.unitsByIndex(0).unitAttributePrefix(0),
      "milli"
    );
    assert.strictEqual(ensureValid(fm), true);
    assert.ok(newCurrentElement instanceof fm._cellml.Units);

    // assert.strictEqual(
    //   (newCurrentElement as Units).unitCount(),
    //   1,
    //   "New unit not added"
    // );
    assert.strictEqual(
      (newCurrentElement as Units).unitAttributeExponent(0),
      32,
      "Current element has wrong exponent"
    );
    assert.strictEqual(
      (newCurrentElement as Units).unitAttributeMultiplier(0),
      2,
      "Current element has wrong multiplier"
    );
    assert.strictEqual(
      (newCurrentElement as Units).unitAttributeReference(0),
      "second",
      "Current element has wrong reference"
    );
    assert.strictEqual(
      (newCurrentElement as Units).unitAttributePrefix(0),
      "milli",
      "Current element has wrong prefix"
    );
  });
});
