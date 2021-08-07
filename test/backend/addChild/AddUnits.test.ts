import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { Model, Parser, Printer } from "../../../src/types/ILibcellml";
import { Elements } from "../../../src/types/Elements";
import { ChildUnitsDetail } from "../../../src/types/ChildDetail";
import { addUnits } from "../../../src/backend/addChild/addUnits";

describe("Adding Units to Model", function () {
  this.timeout(5000);
  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");
    // Assigning model
    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(m, Elements.model);
  });

  afterEach(async () => {
    fm.newFile();
  });

  it("Adds local Units", async () => {
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

    addUnits(fm, child);

    // Validation
    const newModel = fm._parser.parseModel(fm.getContent());
    assert.strictEqual(newModel.unitsCount(), 1);
    assert.strictEqual(newModel.unitsByIndex(0).name(), "u1");
    assert.strictEqual(newModel.unitsByIndex(0).isImport(), false);
  });

  it("Adds imported Units", async () => {
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

    addUnits(fm, child);

    // Validation
    const newModel = fm._parser.parseModel(fm.getContent());
    assert.strictEqual(newModel.unitsCount(), 1);
    assert.strictEqual(newModel.unitsByIndex(0).name(), "u1");
    assert.strictEqual(newModel.unitsByIndex(0).isImport(), true);
  });
});
