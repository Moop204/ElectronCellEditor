import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { Model, Parser, Printer, Units } from "../../../src/types/ILibcellml";
import { Elements } from "../../../src/types/Elements";
import { ChildUnitDetail } from "../../../src/types/ChildDetail";
import { AddUnit } from "../../../src/backend/addChild/AddUnit";

describe("Adding Unit to Units", function () {
  this.timeout(5000);

  it("Adds standard Unit", async () => {
    const fm = new FileManagement();
    await fm.init();

    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");
    const u: Units = new fm._cellml.Units();
    u.setName("u1");
    m.addUnits(u);

    // Assigning model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(u, Elements.units);

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

    AddUnit(fm, child);

    // Validation
    const updatedContent = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const newModel = parser.parseModel(updatedContent);
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
  });
});
