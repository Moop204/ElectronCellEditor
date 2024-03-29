import FileManagement from "../src/backend/FileManagement";

const libcellModule = require("libcellml.js/libcellml.common");

import assert from "assert";
import {
  Component,
  Model,
  Parser,
  Printer,
  Reset,
  Units,
  Variable,
} from "../src/types/ILibcellml";
import { stripMath } from "../src/frontend/sidebar/math/stripMath";
import { Elements } from "../src/types/Elements";
import { updateMath } from "../src/backend/updateAttribute/updateMath";
import { updateNameOfVariable } from "../src/backend/updateAttribute/updateName/updateNameOfVariable";
import { getAllVariableNames } from "../src/utility/variable/getAllVariableNames";

const validMathMl = (fm: FileManagement, mathml: string): boolean => {
  const cellml = fm._cellml;
  const m: Model = new cellml.Model();
  m.setName("m");
  const c1: Component = new cellml.Component();
  c1.setName("c1");
  c1.setMath(mathml);
  m.addComponent(c1);
  const stringedModel = fm._printer.printModel(m, true);
  console.log(stringedModel);
  return stringedModel !== "";
};

describe("array", () => {
  it("add equivalence", async () => {
    const fm = new FileManagement();
    await fm.init();

    const m: Model = new fm._cellml.Model();
    m.setName("model");
    const c1: Component = new fm._cellml.Component();
    c1.setName("c1");
    const v1: Variable = new fm._cellml.Variable();
    v1.setName("v1");
    v1.setUnitsByName("second");

    const c2: Component = new fm._cellml.Component();
    c2.setName("c1");
    const v2: Variable = new fm._cellml.Variable();
    v2.setName("v2");
    v2.setUnitsByName("second");

    c1.addVariable(v1);
    c2.addVariable(v2);
    m.addComponent(c1);
    m.addComponent(c2);

    const commandVar: Variable = fm._cellml.Variable;
    commandVar.addEquivalence(v1, v2);

    console.log(fm._printer.printModel(m, false));
  });

  // it("obtains all var names", async () => {
  //   const fm = new FileManagement();
  //   await fm.init();

  //   const m: Model = new fm._cellml.Model();
  //   m.setName("model");
  //   const c1: Component = new fm._cellml.Component();
  //   c1.setName("c1");
  //   const v1: Variable = new fm._cellml.Variable();
  //   v1.setName("v1");
  //   v1.setUnitsByName("second");
  //   const r: Reset = new fm._cellml.Reset();
  //   r.setOrder(1);
  //   const mathValue =
  //     `<math xmlns="http://www.w3.org/1998/Math/MathML"><ci>v1</ci></math>`.trim();
  //   r.setResetValue(mathValue);
  //   r.setTestValue(mathValue);
  //   r.setTestVariable(v1);
  //   r.setVariable(v1);

  //   c1.addVariable(v1);
  //   c1.addReset(r);
  //   m.addComponent(c1);

  //   fm.updateContentFromModel(m);
  //   // fm.setCurrentComponent(r, Elements.reset);
  //   fm.resetToModel();

  //   const res = await getAllVariableNames(fm);
  //   console.log(res);
  // });

  // it("checks reset parents", async () => {
  //   const fm = new FileManagement();
  //   await fm.init();

  //   const m: Model = new fm._cellml.Model();
  //   m.setName("model");
  //   const c1: Component = new fm._cellml.Component();
  //   c1.setName("c1");
  //   const v1: Variable = new fm._cellml.Variable();
  //   v1.setName("v1");
  //   v1.setUnitsByName("second");
  //   const r: Reset = new fm._cellml.Reset();
  //   r.setOrder(1);
  //   const mathValue =
  //     `<math xmlns="http://www.w3.org/1998/Math/MathML"><ci>v1</ci></math>`.trim();
  //   r.setResetValue(mathValue);
  //   r.setTestValue(mathValue);
  //   r.setTestVariable(v1);
  //   r.setVariable(v1);

  //   c1.addVariable(v1);
  //   c1.addReset(r);
  //   m.addComponent(c1);

  //   fm.setContent(fm._printer.printModel(m, false));
  //   fm.setCurrentComponent(r, Elements.reset);

  //   console.log(r.parent());
  //   // const u: Units = new fm._cellml.Units();
  // });

  // it("checks variable parents", async () => {
  //   const fm = new FileManagement();
  //   await fm.init();

  //   const m: Model = new fm._cellml.Model();
  //   m.setName("m1");
  //   const c: Component = new fm._cellml.Component();
  //   c.setName("c1");
  //   const v: Variable = new fm._cellml.Variable();
  //   v.setName("v1");
  //   v.setUnitsByName("second");
  //   c.addVariable(v);
  //   m.addComponent(c);

  //   const { editedModel, editedCurrentElement } = updateNameOfVariable(
  //     m,
  //     v,
  //     { name: "v1", index: null },
  //     "V2"
  //   );
  //   console.log(editedCurrentElement.parent());
  //   console.log(v.parent());
  //   // const u: Units = new fm._cellml.Units();
  // });

  //   it("validates MathML", async () => {
  //     const fm = new FileManagement();
  //     await fm.init();

  //     const validMathML = `<math xmlns="http://www.w3.org/1998/Math/MathML" xmlns:cellml="http://www.cellml.org/cellml/2.0#">
  //     <apply>
  //       <eq/>
  //         <ci>t</ci>
  //         <ci>x</ci>
  //     </apply>
  //   </math>`;
  //     const invalidMathML = `<math xmlns="http://www.w3.org/1998/Math/MathML" xmlns:cellml="http://www.cellml.org/cellml/2.0#">
  //   <apply>
  //     <eq/>
  //       <ci>t</ci>
  //       <ci>x</ci
  //   </apply>
  // </math>`;

  //     const validRes = validMathMl(fm, validMathML);
  //     const invalidRes = validMathMl(fm, invalidMathML);

  //     assert.ok(validRes);
  //     assert.ok(!invalidRes);
  //   });

  // it("checks for imported", async () => {
  //   const fm = new FileManagement();
  //   await fm.init();
  //   const u: Units = new fm._cellml.Units();
  //   u.setName("a");
  //   assert.strictEqual(u.isImport(), false);
  // });
  // it("math-testing", async () => {
  //   const fm = new FileManagement();
  //   await fm.init();
  //   const cellml = fm._cellml;
  //   const m: Model = new cellml.Model();
  //   m.setName("m");
  //   const c1: Component = new cellml.Component();
  //   c1.setName("c1");
  //   c1.setMath(`<math xmlns="http://www.w3.org/1998/Math/MathML" xmlns:cellml="http://www.cellml.org/cellml/2.0#">
  //         <apply>
  //           <eq/>
  //             <ci>t</ci>
  //             <ci>x</ci>
  //         </apply>
  //       </math>`);
  //   // c1.setMath("Kyaaaaa");
  //   // c1.setMath("<math><apply><eq/><cix</ci><ci>y</ci></math>");
  //   m.addComponent(c1);

  //   const printer: Printer = new cellml.Printer();
  //   console.log("ahhhh");
  //   console.log(printer.printModel(m, true));
  //   console.log("haaaa");
  //   assert.ok(m instanceof cellml.Model);
  //   console.log(m.name());
  //   console.log(m.componentByIndex(0).name());
  //   console.log(m.componentByIndex(0).math());
  //   // assert.ok(m === null);
  // });

  // it("checking type", async () => {
  //   const fm = new FileManagement();
  //   await fm.init();
  //   const cellml = fm._cellml;
  //   const m = new cellml.Model();
  //   const c1 = new cellml.Component();
  //   console.log(c1 instanceof fm._cellml.Component);
  //   assert.strictEqual(JSON.stringify(c1), JSON.stringify(m));
  // });
  // it("cuts down on math string", async () => {
  //   const working = `<apply><eq/> <apply><diff/> <bvar><ci>t</ci></bvar> <ci>N</ci> </apply> <apply><divide/> <apply><times/> <ci>r</ci> <ci>N</ci> <apply><minus/> <ci>K</ci> <ci>N</ci> </apply> </apply> <bvar><ci>K</ci></bvar> </apply> </apply>`;
  //   const bugged = `<math xmlns="http://www.w3.org/1998/Math/MathML">
  //   <apply><eq/>
  //     <apply><diff/>
  //       <bvar><ci>t</ci></bvar>
  //       <ci>N</ci>
  //     </apply>
  //     <apply><divide/>
  //       <apply><times/>
  //         <ci>r</ci>
  //         <ci>N</ci>
  //         <apply><minus/>
  //           <ci>K</ci>
  //           <ci>N</ci>
  //         </apply>
  //       </apply>
  //       <bvar><ci>K</ci></bvar>
  //     </apply>
  //   </apply>
  // </math>`;
  //   let pw = stripMath(working);
  //   let pb = stripMath(bugged);
  //   pw = pw.replace(/\s/g, "");

  //   pb = pb.replace(/\s/g, "");
  //   assert.strictEqual(pw.trim(), pb.trim());
  // });
  // it("compares two units", async () => {
  //   const cellml = await libcellModule();
  //   const u1 = new cellml.Units();
  //   u1.setName("u1");
  //   const u2 = new cellml.Units();
  //   u2.setName("u2");
  //   const res = new cellml.Units().compatible(u1, u2);
  //   assert.strictEqual(res, true);
  // });
});
