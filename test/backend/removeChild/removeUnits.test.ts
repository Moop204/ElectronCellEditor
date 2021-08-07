import { Model, Parser, Printer, Units } from "../../../src/types/ILibcellml";
import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { IChild } from "../../../src/types/IProperties";
import { removeUnits } from "../../../src/backend/removeChild/removeUnits";

describe("Removing CellML Units in property format", function () {
  this.timeout(5000);
  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
  });
  it("Removing Units", async () => {
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const u: Units = new fm._cellml.Units();
    u.setName("u1");
    m.addUnits(u);

    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.resetToModel();

    const child: IChild = {
      name: "u1",
      index: 0,
    };

    removeUnits(fm, child);

    const postRemoval = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const postModel = parser.parseModel(postRemoval);
    // Check attributes of element are preserved
    assert.strictEqual(
      postModel.unitsCount(),
      0,
      "No Units remain after removing only variable."
    );
    // Check children
    assert.strictEqual(
      fm.getCurrentComponent() instanceof fm._cellml.Model,
      true,
      "Current element remains the same"
    );
  });
});
