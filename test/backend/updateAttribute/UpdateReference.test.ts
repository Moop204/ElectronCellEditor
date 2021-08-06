import assert from "assert";
import FileManagement from "../../../src/backend/FileManagement";
import { Elements } from "../../../src/types/Elements";
import { Model, Units } from "../../../src/types/ILibcellml";
import { IUpdate } from "../../../src/types/IQuery";

describe("Updating reference attribute from a Unit", function () {
  this.timeout(5000);
  let fm: FileManagement;
  const newValue = "joules";
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
  });

  it("Updating reference with a standard Units", async () => {
    const m: Model = new fm._cellml.Model();
    m.setName("model");
    const u: Units = new fm._cellml.Units();
    u.setName("u1");
    u.addUnitByReferenceExponent("second", 12, "second");
    m.addUnits(u);

    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(u, Elements.units);

    const update: IUpdate = {
      element: Elements.units,
      select: {
        name: "u1",
        index: 0,
      },
      attribute: "units_reference",
      value: newValue,
    };

    fm.update([update], fm.getContent(), fm.getCurrentComponent(), fm);

    const newCurrentElement = fm.getCurrentComponent();
    const newModel = fm._parser.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Units).unitAttributeReference(0),
      newValue,
      "Current selection name not changed."
    );
    assert.strictEqual(
      (newModel as Model).unitsByIndex(0).unitAttributeReference(0),
      newValue,
      "Model name not changed."
    );
  });
});
