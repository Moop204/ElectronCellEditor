import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import {
  Component,
  Model,
  Parser,
  Printer,
  Variable,
} from "../../../src/types/ILibcellml";
import { Elements } from "../../../src/types/Elements";
import { ChildConnectionDetail } from "../../../src/types/ChildDetail";
import { addConnection } from "../../../src/backend/addChild/addConnection";
import { ensureValid } from "../../../src/utility/ensureValid";

describe("Adding Connection to Model", function () {
  this.timeout(5000);
  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
  });

  it("Add basic variable", async () => {
    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");
    const c1: Component = new fm._cellml.Component();
    c1.setName("c1");
    const c2: Component = new fm._cellml.Component();
    c2.setName("c2");
    const v1: Variable = new fm._cellml.Variable();
    v1.setName("v1");
    v1.setUnitsByName("second");
    v1.setInterfaceTypeByString("public");
    const v2: Variable = new fm._cellml.Variable();
    v2.setName("v2");
    v2.setUnitsByName("second");
    v2.setInterfaceTypeByString("public");

    c1.addVariable(v1);
    c2.addVariable(v2);
    m.addComponent(c1);
    m.addComponent(c2);

    // Assigning model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(c1, Elements.component);

    // Applying update
    const child: ChildConnectionDetail = {
      type: Elements.connection,
      attribute: {
        component1: "c1",
        variable1: "v1",
        component2: "c2",
        variable2: "v2",
      },
    };

    addConnection(fm, child);

    // Validation
    const updatedContent = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const newModel = parser.parseModel(updatedContent);
    const newV1 = newModel.componentByIndex(0).variableByIndex(0);
    const newV2 = newModel.componentByIndex(1).variableByIndex(0);
    assert.ok(ensureValid(fm), "Resulting CellML file is invalid");
    assert.strictEqual(
      newV1.equivalentVariableCount(),
      1,
      "First Variable not equivalent"
    );
    assert.strictEqual(
      newV2.equivalentVariableCount(),
      1,
      "Second Variable not equivalent"
    );
  });
});
