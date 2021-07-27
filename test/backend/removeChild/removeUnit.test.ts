import { Model, Parser, Printer, Units } from "../../../src/types/ILibcellml";
import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { IChild } from "../../../src/types/IProperties";
import { removeUnit } from "../../../src/backend/removeChild/removeUnit";
import { Elements } from "../../../src/types/Elements";

describe("Removing CellML Unit in property format", function () {
  this.timeout(5000);
  it("Removing Unit", async () => {
    const fm = new FileManagement();
    await fm.init();
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const u: Units = new fm._cellml.Units();
    u.setName("u1");
    u.addUnitByReference("second");
    m.addUnits(u);

    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(u, Elements.units);

    const child: IChild = {
      name: null,
      index: 0,
    };

    removeUnit(fm, child);

    const postRemoval = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const postModel = parser.parseModel(postRemoval);
    // Check attributes of element are preserved
    assert.strictEqual(
      postModel.unitsByIndex(0).unitCount(),
      0,
      "No Unit remain after removing only variable."
    );
    // Check children
    assert.strictEqual(
      fm.getCurrentComponent() instanceof fm._cellml.Units,
      true,
      "Current element remains the same"
    );
  });
});
