import {
  Component,
  ImportSource,
  Model,
  Parser,
  Printer,
} from "../../../src/types/ILibcellml";
import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { removeComponent } from "../../../src/backend/removeChild/removeComponent";
import { IChild } from "../../../src/types/IProperties";

describe("Removing CellML Component into property format", function () {
  this.timeout(5000);
  let fm: FileManagement;
  let m: Model;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();
    m = new fm._cellml.Model();
    m.setName("testModel");
    const c1: Component = new fm._cellml.Component();
    c1.setName("c1");

    const c2: Component = new fm._cellml.Component();
    c2.setName("c2");
    c2.importSource;
    const importSource: ImportSource = new fm._cellml.ImportSource();
    importSource.setUrl("source");
    c2.setSourceComponent(importSource, "component_ref");

    m.addComponent(c1);
    m.addComponent(c2);
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    await fm.resetToModel();
  });

  it("Removing local Component", async () => {
    const child: IChild = {
      name: "c1",
      index: 0,
    };
    removeComponent(fm, child);
    const postRemoval = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const postModel = parser.parseModel(postRemoval);
    // Check attributes of element are preserved
    assert.strictEqual(
      postModel.componentCount(),
      m.componentCount() - 1,
      "Component count decreases by one"
    );
    // Check children
    assert.strictEqual(
      fm.getCurrentComponent() instanceof fm._cellml.Model,
      true,
      "Current element remains the same"
    );
  });
  it("Removing imported Component", async () => {
    const child: IChild = {
      name: "c2",
      index: 0,
    };

    removeComponent(fm, child);

    const postRemoval = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const postModel = parser.parseModel(postRemoval);
    // Check attributes of element are preserved
    assert.strictEqual(
      postModel.componentCount(),
      m.componentCount() - 1,
      "Component count decreases by one"
    );
    // Check children
    assert.strictEqual(
      fm.getCurrentComponent() instanceof fm._cellml.Model,
      true,
      "Current element remains the same"
    );
  });
});
