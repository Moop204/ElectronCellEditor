import assert from "assert";
import FileManagement from "../../../src/backend/FileManagement";
import { updateOrder } from "../../../src/backend/updateAttribute/UpdateOrder";
import { Elements } from "../../../src/types/Elements";
import {
  Component,
  Model,
  Reset,
  Units,
  Variable,
} from "../../../src/types/ILibcellml";
import { IUpdate } from "../../../src/types/IQuery";

describe("Updating exponent attribute", function () {
  this.timeout(5000);
  let fm: FileManagement;
  const newValue = "100";
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
  });

  it("Updating exponent with a number", async () => {
    const m: Model = new fm._cellml.Model();
    m.setName("model");
    const u: Units = new fm._cellml.Units();
    u.setName("u1");
    u.addUnitByReferenceExponent("second", 12, "second");
    m.addUnits(u);

    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(u, Elements.units);

    const update: IUpdate = {
      element: Elements.unit,
      select: {
        name: "u1",
        index: 0,
      },
      attribute: "exponent",
      value: newValue,
    };

    fm.update([update], fm.getContent(), fm.getCurrentComponent(), fm);

    const newCurrentElement = fm.getCurrentComponent();
    const newModel = fm._parser.parseModel(fm.getContent());
    assert.strictEqual(
      (newCurrentElement as Units).unitAttributeExponent(0),
      newValue,
      "Current selection name not changed."
    );
    assert.strictEqual(
      (newModel as Model).unitsByIndex(0).unitAttributeExponent(0),
      newValue,
      "Model name not changed."
    );
  });
});
