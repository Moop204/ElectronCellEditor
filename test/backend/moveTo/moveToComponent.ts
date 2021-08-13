import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import {
  Component,
  Model,
  Parser,
  Printer,
} from "../../../src/types/ILibcellml";
import { addComponent } from "../../../src/backend/addChild/addComponent";
import { Elements } from "../../../src/types/Elements";
import { ChildComponentDetail } from "../../../src/types/ChildDetail";
import { moveTo } from "../../../src/backend/moveTo/moveTo";
import { IMoveTo } from "../../../src/backend/moveTo/interfaces";

describe("Move to component in model", function () {
  this.timeout(5000);

  let fm: FileManagement;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");
    const c1: Component = new fm._cellml.Component();
    c1.setName("c1");
    m.addComponent(c1);
    // Assigning model
    fm.setContent(fm._printer.printModel(m, false));
    fm.setCurrentComponent(m, Elements.model);
  });

  afterEach(async () => {
    fm.newFile();
  });

  it("Moves to local component", async () => {
    // Applying update
    const move: IMoveTo = {
      element: Elements.component,
      index: 0,
      parent: "test_model",
    };

    assert.strictEqual(
      (fm.getCurrentComponent() as Model).name(),
      "test_model"
    );

    moveTo(move, fm);

    const cur = fm.getCurrentComponent() as Component;
    assert.strictEqual(cur.name(), "c1");
  });
  // it("Adds imported component", async () => {
  //   // Applying update
  //   const child: ChildComponentDetail = {
  //     type: Elements.component,
  //     attribute: {
  //       name: "child_component",
  //       imported: true,
  //       source: "somewhere",
  //       component_ref: "to_be_imported",
  //     },
  //   };

  //   addComponent(fm, Elements.model, child);

  //   // Validation
  // const newModel = fm._parser.parseModel(fm.getContent());
  // assert.strictEqual(newModel.componentCount(), 1);
  // assert.strictEqual(newModel.componentByIndex(0).name(), "child_component");
  // // Added as issue #916 to libcellml
  // //    assert.strictEqual(newModel.componentByIndex(0).isImport(), true);
  // // assert.strictEqual(
  // //   newModel.componentByIndex(0).importReference(),
  // //   "to_be_imported"
  // // );
  // // assert.strictEqual(
  // //   newModel.componentByIndex(0).importSource(),
  // //   "somewhere"
  // // );
  // });
});
