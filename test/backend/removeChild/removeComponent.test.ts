import { Elements } from "../../../src/types/Elements";
import {
  Component,
  ImportSource,
  Model,
  Parser,
  Printer,
  Units,
  Variable,
} from "../../../src/types/ILibcellml";
import FileManagement from "../../../src/backend/FileManagement";
import { convertSelectedElement } from "../../../src/backend/converter/ConvertElement";
import assert from "assert";
import { RemoveComponent } from "../../../src/backend/removeChild/removeComponent";
import { IChild } from "../../../src/types/IProperties";

describe("Removing CellML Component into property format", function () {
  this.timeout(5000);
  it("Removing local Component", async () => {
    const fm = new FileManagement();
    await fm.init();
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const component: Component = new fm._cellml.Component();
    component.setName("c1");
    m.addComponent(component);
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    await fm.resetToModel();
    const child: IChild = {
      name: "c1",
      index: 0,
    };
    RemoveComponent(fm, child);
    const postRemoval = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const postModel = parser.parseModel(postRemoval);
    // Check attributes of element are preserved
    assert.strictEqual(
      postModel.componentCount(),
      0,
      "No components remain after removing"
    );
    // Check children
    assert.strictEqual(
      fm.getCurrentComponent() instanceof fm._cellml.Model,
      true,
      "Current element remains the same"
    );
  });
  it("Removing imported Component", async () => {
    const fm = new FileManagement();
    await fm.init();
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const component: Component = new fm._cellml.Component();
    component.setName("c1");
    component.importSource;
    const importSource: ImportSource = new fm._cellml.ImportSource();
    importSource.setUrl("source");
    component.setSourceComponent(importSource, "component_ref");

    m.addComponent(component);
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    await fm.resetToModel();
    const child: IChild = {
      name: "c1",
      index: 0,
    };
    RemoveComponent(fm, child);
    const postRemoval = fm.getContent();
    const parser: Parser = new fm._cellml.Parser();
    const postModel = parser.parseModel(postRemoval);
    // Check attributes of element are preserved
    assert.strictEqual(
      postModel.componentCount(),
      0,
      "No components remain after removing"
    );
    // Check children
    assert.strictEqual(
      fm.getCurrentComponent() instanceof fm._cellml.Model,
      true,
      "Current element remains the same"
    );
  });
});
