import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import {
  Component,
  Model,
  Parser,
  Printer,
} from "../../../src/types/ILibcellml";
import { AddComponent } from "../../../src/backend/addChild/AddComponent";
import { Elements } from "../../../src/types/Elements";
import { ChildComponentDetail } from "../../../src/types/ChildDetail";

describe("Adding component to model", function () {
  this.timeout(5000);

  it("Adds local component", async () => {
    const fm = new FileManagement();
    await fm.init();

    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");

    // Assigning model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));

    // Applying update
    const child: ChildComponentDetail = {
      type: Elements.component,
      attribute: {
        name: "child_component",
        imported: false,
        source: null,
        component_ref: null,
      },
    };

    AddComponent(fm, Elements.model, child);

    const updatedContent = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const newModel = parser.parseModel(updatedContent);
    assert.strictEqual(newModel.componentCount(), 1);
    assert.strictEqual(newModel.componentByIndex(0).name(), "child_component");
  });
  it("Adds imported component", async () => {
    const fm = new FileManagement();
    await fm.init();

    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");

    // Assigning model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));

    // Applying update
    const child: ChildComponentDetail = {
      type: Elements.component,
      attribute: {
        name: "child_component",
        imported: true,
        source: "somewhere",
        component_ref: "to_be_imported",
      },
    };

    AddComponent(fm, Elements.model, child);

    // Validation
    const updatedContent = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const newModel = parser.parseModel(updatedContent);
    assert.strictEqual(newModel.componentCount(), 1);
    assert.strictEqual(newModel.componentByIndex(0).name(), "child_component");
    // Added as issue #916 to libcellml
    //    assert.strictEqual(newModel.componentByIndex(0).isImport(), true);
    // assert.strictEqual(
    //   newModel.componentByIndex(0).importReference(),
    //   "to_be_imported"
    // );
    // assert.strictEqual(
    //   newModel.componentByIndex(0).importSource(),
    //   "somewhere"
    // );
  });
});

describe("Adding component to component", function () {
  this.timeout(5000);
  it("Adds local component", async () => {
    const fm = new FileManagement();
    await fm.init();

    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");
    const c1: Component = new fm._cellml.Component();
    c1.setName("c1");
    m.addComponent(c1);

    assert.strictEqual(m.componentCount(), 1);

    // Assigning model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(c1, Elements.component);

    // Applying update
    const child: ChildComponentDetail = {
      type: Elements.component,
      attribute: {
        name: "child_component",
        imported: false,
        source: null,
        component_ref: null,
      },
    };

    AddComponent(fm, Elements.component, child);

    // Validation
    const updatedContent = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const newModel = parser.parseModel(updatedContent);
    assert.strictEqual(newModel.componentByIndex(0).componentCount(), 1);
    assert.strictEqual(
      newModel.componentByIndex(0).componentByIndex(0).name(),
      "child_component"
    );
  });
  it("Adds imported component", async () => {
    const fm = new FileManagement();
    await fm.init();

    // Building model
    const m: Model = new fm._cellml.Model();
    m.setName("test_model");
    const c1: Component = new fm._cellml.Component();
    c1.setName("c1");
    m.addComponent(c1);

    // Assigning model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(c1, Elements.component);

    // Applying update
    const child: ChildComponentDetail = {
      type: Elements.component,
      attribute: {
        name: "child_component",
        imported: true,
        source: "somewhere",
        component_ref: "to_be_imported",
      },
    };

    AddComponent(fm, Elements.component, child);

    // Validation
    const updatedContent = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const newModel = parser.parseModel(updatedContent);
    const curComp = newModel.componentByIndex(0);
    assert.strictEqual(curComp.componentCount(), 1);
    assert.strictEqual(curComp.componentByIndex(0).name(), "child_component");
    // Added as issue #916 to libcellml
    //    assert.strictEqual(newModel.componentByIndex(0).isImport(), true);
    // assert.strictEqual(
    //   newModel.componentByIndex(0).importReference(),
    //   "to_be_imported"
    // );
    // assert.strictEqual(
    //   newModel.componentByIndex(0).importSource(),
    //   "somewhere"
    // );
  });
});
