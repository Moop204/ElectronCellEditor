import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { Model, Parser, Printer } from "../../../src/types/ILibcellml";
import { Elements } from "../../../src/types/Elements";
import { ChildUnitsDetail } from "../../../src/types/ChildDetail";
import { AddUnits } from "../../../src/backend/addChild/AddUnits";

describe("Adding Units to Model", function () {
  this.timeout(5000);

  it("Adds local Units", async () => {
    const fm = new FileManagement();
    await fm.init();

    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");

    // Assigning model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(m, Elements.model);

    // Applying update
    const child: ChildUnitsDetail = {
      type: Elements.units,
      attribute: {
        name: "u1",
        imported: false,
        source: null,
        component_ref: null,
      },
    };

    AddUnits(fm, child);

    // Validation
    const updatedContent = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const newModel = parser.parseModel(updatedContent);
    assert.strictEqual(newModel.unitsCount(), 1);
    assert.strictEqual(newModel.unitsByIndex(0).name(), "u1");
  });

  it("Adds imported Units", async () => {
    const fm = new FileManagement();
    await fm.init();

    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");

    // Assigning model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(m, Elements.model);

    // Applying update
    const child: ChildUnitsDetail = {
      type: Elements.units,
      attribute: {
        name: "u1",
        imported: true,
        source: "src",
        component_ref: "reference",
      },
    };

    AddUnits(fm, child);

    // Validation
    const updatedContent = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const newModel = parser.parseModel(updatedContent);
    assert.strictEqual(newModel.unitsCount(), 1);
    assert.strictEqual(newModel.unitsByIndex(0).name(), "u1");
    //assert.strictEqual(newModel.unitsByIndex(0).isImport(), true);
  });
});
