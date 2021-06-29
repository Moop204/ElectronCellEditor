import React from "react";
import FileManagement from "../src/backend/FileManagement";

const libcellModule = require("libcellml.js/libcellml.common");

import assert from "assert";
import {
  Component,
  Model,
  Parser,
  Printer,
  Units,
  Variable,
} from "../src/types/ILibcellml";
import { IUpdate } from "../src/types/IQuery";
import { isVariableDeclaration } from "typescript";
import { Elements } from "../src/types/Elements";

const makeModel = (cellml: any, name: string): Model => {
  const m: Model = new cellml.Model();
  m.setName(name);
  return m;
};

const makeVariable = (
  cellml: any,
  name: string,
  units?: string,
  initialValue?: string,
  interfaceType?: string
): Variable => {
  const v1: Variable = new cellml.Variable();
  v1.setName(name);
  if (units) v1.setUnitsByName(units);
  if (initialValue) v1.setInitialValueByString(initialValue);
  if (interfaceType) v1.setInterfaceTypeByString(interfaceType);
  return v1;
};

const makeComponent = (cellml: any, name: string): Component => {
  const c1: Component = new cellml.Component();
  c1.setName(name);
  return c1;
};

const makeUnits = (cellml: any, name: string): Units => {
  const u1: Units = new cellml.Units();
  u1.setName(name);
  return u1;
};

describe("Updating Variable", () => {
  it("updates name", async () => {
    const fm = new FileManagement();
    await fm.init();
    const cellml = fm._cellml;
    const m = makeModel(cellml, "testName");

    const v1Name = "variableName";
    const v1 = makeVariable(cellml, v1Name, "second", "24", "none");
    const c1Name = "componentName";
    const c1 = makeComponent(cellml, c1Name);

    c1.addVariable(v1);
    m.addComponent(c1);

    // Set model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(v1, Elements.variable);

    // Generate update
    const updateValue = "newName";
    const updateDescriptor: IUpdate = {
      element: Elements.variable,
      select: { index: null, name: v1Name },
      attribute: "name",
      value: updateValue,
    };

    await fm.update(
      [updateDescriptor],
      fm._cellml,
      fm.getContent(),
      fm.getCurrentComponent(),
      fm
    );

    const resString = fm.getContent();
    const parser: Parser = new cellml.Parser();
    const testModel = parser.parseModel(resString);

    assert.ok(
      testModel.componentByName(c1Name, true).variableByName(updateValue)
    );
  });
  it("updates custom units", async () => {
    const fm = new FileManagement();
    await fm.init();
    const cellml = fm._cellml;
    const m = makeModel(cellml, "testName");

    const u1Name = "unitsName";
    const u1 = makeUnits(cellml, u1Name);
    const v1Name = "variableName";
    const v1 = makeVariable(cellml, v1Name, "metre", "24", "none");
    const c1Name = "componentName";
    const c1 = makeComponent(cellml, c1Name);

    m.addUnits(u1);
    c1.addVariable(v1);
    m.addComponent(c1);

    // Set model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(v1, Elements.variable);

    // Generate update
    const updateAttribute = "units";
    const updateValue = u1Name;
    const updateDescriptor: IUpdate = {
      element: Elements.variable,
      select: { index: null, name: v1Name },
      attribute: updateAttribute,
      value: updateValue,
    };

    await fm.update(
      [updateDescriptor],
      fm._cellml,
      fm.getContent(),
      fm.getCurrentComponent(),
      fm
    );

    const resString = fm.getContent();
    const parser: Parser = new cellml.Parser();
    const testModel = parser.parseModel(resString);

    assert.ok(testModel.componentByName(c1Name, true));
    assert.ok(testModel.componentByName(c1Name, true).variableByName(v1Name));
    assert.strictEqual(
      testModel
        .componentByName(c1Name, true)
        .variableByName(v1Name)
        .units()
        .name(),
      updateValue
    );
  });
  it("updates initial value", async () => {
    const fm = new FileManagement();
    await fm.init();
    const cellml = fm._cellml;
    const m = makeModel(cellml, "testName");

    const v1Name = "variableName";
    const v1 = makeVariable(cellml, v1Name, "second", "24", "none");
    const c1Name = "componentName";
    const c1 = makeComponent(cellml, c1Name);

    c1.addVariable(v1);
    m.addComponent(c1);

    // Set model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(v1, Elements.variable);

    // Generate update
    const updateAttribute = "initialValue";
    const updateValue = "50";
    const updateDescriptor: IUpdate = {
      element: Elements.variable,
      select: { index: null, name: v1Name },
      attribute: updateAttribute,
      value: updateValue,
    };

    await fm.update(
      [updateDescriptor],
      fm._cellml,
      fm.getContent(),
      fm.getCurrentComponent(),
      fm
    );

    const resString = fm.getContent();
    const parser: Parser = new cellml.Parser();
    const testModel = parser.parseModel(resString);

    assert.strictEqual(
      testModel
        .componentByName(c1Name, true)
        .variableByName(v1Name)
        .initialValue(),
      updateValue
    );
  });
  it("updates interface type", async () => {
    const fm = new FileManagement();
    await fm.init();
    const cellml = fm._cellml;
    const m = makeModel(cellml, "testName");

    const v1Name = "variableName";
    const v1 = makeVariable(cellml, v1Name, "second", "24", "none");
    const c1Name = "componentName";
    const c1 = makeComponent(cellml, c1Name);

    c1.addVariable(v1);
    m.addComponent(c1);

    // Set model
    const printer: Printer = new fm._cellml.Printer();
    fm.setContent(printer.printModel(m, false));
    fm.setCurrentComponent(v1, Elements.variable);

    // Generate update
    const updateAttribute = "initialValue";
    const updateValue = "50";
    const updateDescriptor: IUpdate = {
      element: Elements.variable,
      select: { index: null, name: v1Name },
      attribute: updateAttribute,
      value: updateValue,
    };

    await fm.update(
      [updateDescriptor],
      fm._cellml,
      fm.getContent(),
      fm.getCurrentComponent(),
      fm
    );

    const resString = fm.getContent();
    const parser: Parser = new cellml.Parser();
    const testModel = parser.parseModel(resString);

    assert.strictEqual(
      testModel
        .componentByName(c1Name, true)
        .variableByName(v1Name)
        .initialValue(),
      updateValue
    );
  });
});
