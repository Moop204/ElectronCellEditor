import React from "react";
import FileManagement from "../src/backend/FileManagement";

const libcellModule = require("libcellml.js/libcellml.common");

import assert from "assert";
import {
  Component,
  ComponentEntity,
  Model,
  Parser,
  Printer,
  Units,
  Validator,
  Variable,
} from "../src/types/ILibcellml";
import { IUpdate } from "../src/types/IQuery";
import { isVariableDeclaration } from "typescript";
import { Elements } from "../src/types/Elements";
import { findPrivateVariables } from "../src/utility/variable/findPrivateVariables";
import { findPublicVariables } from "../src/utility/variable/findPublicVariables";

describe("Public interfaces", () => {
  it("Connects two sibling variables", async () => {
    const fm = new FileManagement();
    await fm.init();
    const cellml = fm._cellml;

    const v1: Variable = new cellml.Variable();
    v1.setName("v1");
    v1.setUnitsByName("second");
    v1.setInterfaceTypeByString("public");

    const v2: Variable = new cellml.Variable();
    v2.setName("v2");
    v2.setUnitsByName("second");
    v2.setInterfaceTypeByString("public");

    const m: Model = new cellml.Model();
    m.setName("m");
    const c1: Component = new cellml.Component();
    c1.setName("c1");
    c1.addVariable(v1);

    const c2: Component = new cellml.Component();
    c2.setName("c2");
    c2.addVariable(v2);

    m.addComponent(c2);
    m.addComponent(c1);

    cellml.Variable.addEquivalence(v1, v2);

    const printer: Printer = new cellml.Printer();
    const printed = printer.printModel(m, false);
    const parser: Parser = new cellml.Parser();
    const doublePass = parser.parseModel(printed);
    const validator: Validator = new cellml.Validator();
    validator.validateModel(doublePass);
    console.log(printer.printModel(doublePass, false));
    for (let i = 0; i < validator.errorCount(); i++) {
      console.log(validator.error(i).description());
    }
    assert.strictEqual(validator.errorCount(), 0);
  });
});

describe("Private interfaces", () => {
  it("Connects two encapsulated variables", async () => {
    const fm = new FileManagement();
    await fm.init();
    const cellml = fm._cellml;

    const v1: Variable = new cellml.Variable();
    v1.setName("v1");
    v1.setUnitsByName("second");
    v1.setInterfaceTypeByString("private");

    const v2: Variable = new cellml.Variable();
    v2.setName("v2");
    v2.setUnitsByName("second");
    v2.setInterfaceTypeByString("public");

    const m: Model = new cellml.Model();
    m.setName("m");
    const c1: Component = new cellml.Component();
    c1.setName("c1");
    c1.addVariable(v1);

    const c2: Component = new cellml.Component();
    c2.setName("c2");
    c2.addVariable(v2);

    c1.addComponent(c2);
    m.addComponent(c1);

    cellml.Variable.addEquivalence(v2, v1);

    const printer: Printer = new cellml.Printer();
    const printed = printer.printModel(m, false);
    const parser: Parser = new cellml.Parser();
    const doublePass = parser.parseModel(printed);
    const validator: Validator = new cellml.Validator();
    validator.validateModel(doublePass);
    console.log(printer.printModel(doublePass, false));
    for (let i = 0; i < validator.errorCount(); i++) {
      console.log(validator.error(i).description());
    }
    assert.strictEqual(validator.errorCount(), 0);
  });
});

// const findPublicVariables = (
//   sharedParentElm: ComponentEntity,
//   exclude?: string,
// ) => {
//   const validVariables = [];
//   const compNum = sharedParentElm.componentCount();
//   for (let i = 0; i < compNum; i++) {
//     const curComp = sharedParentElm.componentByIndex(i);
//     const varNum = curComp.variableCount();
//     const parentName = curComp.name();
//     if (parentName === exclude) continue;
//     for (let j = 0; j < varNum; j++) {
//       const curVar = curComp.variableByIndex(j);
//       const interfaceType = curVar.interfaceType();
//       switch (interfaceType) {
//         case "public":
//         case "public_and_private":
//           if(curVar.units().)
//           const varName = curVar.name();
//           validVariables.push({ parent: parentName, variable: varName });
//           break;
//       }
//     }
//   }
//   return validVariables;
// };

interface IVarIdentifier {
  parent: string;
  variable: string;
}

describe("Identify public variables", () => {
  it("finds all public variables", async () => {
    const fm = new FileManagement();
    await fm.init();
    const cellml = fm._cellml;

    const v1: Variable = new cellml.Variable();
    v1.setName("v1");
    v1.setUnitsByName("second");
    v1.setInterfaceTypeByString("public");

    const v2: Variable = new cellml.Variable();
    v2.setName("v2");
    v2.setUnitsByName("second");
    v2.setInterfaceTypeByString("public_and_private");

    const v3: Variable = new cellml.Variable();
    v3.setName("v3");
    v3.setUnitsByName("second");
    v3.setInterfaceTypeByString("public");

    const m: Model = new cellml.Model();
    m.setName("m");

    const c1: Component = new cellml.Component();
    c1.setName("c1");
    c1.addVariable(v1);

    const c2: Component = new cellml.Component();
    c2.setName("c2");
    c2.addVariable(v2);

    const c3: Component = new cellml.Component();
    c3.setName("c3");
    c3.addVariable(v3);

    c1.addComponent(c2);
    m.addComponent(c1);
    m.addComponent(c3);

    const res = findPublicVariables(m, v3, c3.name());
    assert.strictEqual(res.length, 1);
  });
});

describe("Identify private variables", () => {
  it("finds all private variables", async () => {
    const fm = new FileManagement();
    await fm.init();
    const cellml = fm._cellml;

    const v1: Variable = new cellml.Variable();
    v1.setName("v1");
    v1.setUnitsByName("second");
    v1.setInterfaceTypeByString("public_and_private");

    const v2: Variable = new cellml.Variable();
    v2.setName("v2");
    v2.setUnitsByName("second");
    v2.setInterfaceTypeByString("public_and_private");

    const v3: Variable = new cellml.Variable();
    v3.setName("v3");
    v3.setUnitsByName("second");
    v3.setInterfaceTypeByString("public_and_private");

    const v4: Variable = new cellml.Variable();
    v4.setName("v4");
    v4.setUnitsByName("second");
    v4.setInterfaceTypeByString("public_and_private");

    const m: Model = new cellml.Model();
    m.setName("m");

    const c1: Component = new cellml.Component();
    c1.setName("c1");
    c1.addVariable(v1);

    const c2: Component = new cellml.Component();
    c2.setName("c2");
    c2.addVariable(v2);

    const c3: Component = new cellml.Component();
    c3.setName("c3");
    c3.addVariable(v3);

    const c4: Component = new cellml.Component();
    c4.setName("c4");
    c4.addVariable(v4);

    c2.addComponent(c4);
    c1.addComponent(c2);
    c1.addComponent(c3);
    m.addComponent(c1);

    const res = findPrivateVariables(c1, v1);
    console.log(res);
    assert.strictEqual(res.length, 2);
  });
});
