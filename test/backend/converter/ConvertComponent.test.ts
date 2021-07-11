import assert from "assert";
import { convertComponent } from "../../../src/backend/converter/ConvertComponent";
import { convertSelectedElement } from "../../../src/backend/converter/ConvertElement";
import FileManagement from "../../../src/backend/FileManagement";
import { Elements } from "../../../src/types/Elements";
import { Model, Variable, Component } from "../../../src/types/ILibcellml";

describe("Converting CellML Component into property format", function () {
  this.timeout(5000);
  it("Converting Basic Component", async () => {
    const fm = new FileManagement();
    await fm.init();

    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const component: Component = new fm._cellml.Component();
    component.setName("testComponent1");
    m.addComponent(component);
    // Give model to converter
    const convertedElement = convertSelectedElement(
      Elements.component,
      component,
      fm
    );

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.component);
    assert.strictEqual(Object.keys(convertedElement.attribute).length, 2);
    assert.ok(convertedElement.attribute["name"]);
    assert.strictEqual(convertedElement.attribute["name"], "testComponent1");
    assert.strictEqual(convertedElement.attribute["math"], "");
    // Check children
    assert.strictEqual(convertedElement.children["component"].length, 0);
    assert.strictEqual(convertedElement.children["variable"].length, 0);
  });

  it("Converting a Component with math", async () => {
    const fm = new FileManagement();
    await fm.init();
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const component: Component = new fm._cellml.Component();
    component.setName("testComponent1");
    m.addComponent(component);
    // Give model to converter
    const convertedElement = convertComponent(component);

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.component);
    assert.strictEqual(Object.keys(convertedElement.attribute).length, 2);
    assert.ok(convertedElement.attribute["name"]);
    assert.strictEqual(convertedElement.attribute["name"], "testComponent1");
    assert.strictEqual(convertedElement.attribute["math"], "");
    // Check children
    assert.strictEqual(convertedElement.children["component"].length, 0);
    assert.strictEqual(convertedElement.children["variable"].length, 0);
  });

  it("Converting Component of Component", async () => {
    const fm = new FileManagement();
    await fm.init();

    // Make Component
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const componentParent: Component = new fm._cellml.Component();
    componentParent.setName("testComponent1");
    m.addComponent(componentParent);
    const component: Component = new fm._cellml.Component();
    component.setName("testComponent2");
    componentParent.addComponent(component);

    // Give model to converter
    const convertedElement = convertComponent(component);

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.component);
    assert.ok(convertedElement.attribute["name"]);
    assert.strictEqual(convertedElement.attribute["name"], "testComponent2");
    assert.strictEqual(convertedElement.attribute["math"], "");

    // Check children
    assert.strictEqual(convertedElement.children["component"].length, 0);
    assert.strictEqual(convertedElement.children["variable"].length, 0);
  });

  it("Converting Component with Component Child", async () => {
    const fm = new FileManagement();
    await fm.init();

    // Make Component
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const componentParent: Component = new fm._cellml.Component();
    componentParent.setName("testComponent1");
    m.addComponent(componentParent);
    const component: Component = new fm._cellml.Component();
    component.setName("testComponent2");
    componentParent.addComponent(component);

    // Give model to converter
    const convertedElement = convertComponent(componentParent);

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.component);
    assert.ok(convertedElement.attribute["name"]);
    assert.strictEqual(convertedElement.attribute["name"], "testComponent1");
    assert.strictEqual(convertedElement.attribute["math"], "");

    // Check children
    assert.strictEqual(convertedElement.children["component"].length, 1);
    assert.strictEqual(convertedElement.children["variable"].length, 0);
  });

  it("Converting Component with Variable Child", async () => {
    const fm = new FileManagement();
    await fm.init();

    // Make Component
    const m: Model = new fm._cellml.Model();
    m.setName("testModel");
    const componentParent: Component = new fm._cellml.Component();
    componentParent.setName("testComponent1");
    m.addComponent(componentParent);
    const variable: Variable = new fm._cellml.Variable();
    variable.setName("testComponent2");
    componentParent.addVariable(variable);

    // Give model to converter
    const convertedElement = convertComponent(componentParent);

    // Check attributes of element are preserved
    assert.strictEqual(convertedElement.type, Elements.component);
    assert.ok(convertedElement.attribute["name"]);
    assert.strictEqual(convertedElement.attribute["name"], "testComponent1");
    assert.strictEqual(convertedElement.attribute["math"], "");

    // Check children
    assert.strictEqual(convertedElement.children["component"].length, 0);
    assert.strictEqual(convertedElement.children["variable"].length, 1);
  });
});
