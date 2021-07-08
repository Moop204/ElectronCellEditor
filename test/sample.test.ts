import React from "react";
import FileManagement from "../src/backend/FileManagement";

const libcellModule = require("libcellml.js/libcellml.common");

import assert from "assert";
import { Printer } from "../src/types/ILibcellml";
import { stripMath } from "../src/frontend/sidebar/math/stripMath";

describe("array", () => {
  it("does a lib", async () => {
    const cellml = await libcellModule();
    const m = new cellml.Model();
    const c1 = new cellml.Component();
    c1.setName("a");
    m.addComponent(c1);
    c1.setName("b");

    const printer: Printer = new cellml.Printer();
    console.log(printer.printModel(m, false));
  });
  it("cuts down on math string", async () => {
    const working = `<apply><eq/> <apply><diff/> <bvar><ci>t</ci></bvar> <ci>N</ci> </apply> <apply><divide/> <apply><times/> <ci>r</ci> <ci>N</ci> <apply><minus/> <ci>K</ci> <ci>N</ci> </apply> </apply> <bvar><ci>K</ci></bvar> </apply> </apply>`;
    const bugged = `<math xmlns="http://www.w3.org/1998/Math/MathML"> 
    <apply><eq/> 
      <apply><diff/>
        <bvar><ci>t</ci></bvar>
        <ci>N</ci>
      </apply>
      <apply><divide/>
        <apply><times/>
          <ci>r</ci>
          <ci>N</ci>
          <apply><minus/> 
            <ci>K</ci>
            <ci>N</ci>
          </apply> 
        </apply>
        <bvar><ci>K</ci></bvar>
      </apply>        
    </apply>
  </math>`;
    let pw = stripMath(working);
    let pb = stripMath(bugged);
    pw = pw.replace(/\s/g, "");

    pb = pb.replace(/\s/g, "");
    assert.strictEqual(pw.trim(), pb.trim());
  });
  it("compares two units", async () => {
    const cellml = await libcellModule();
    const u1 = new cellml.Units();
    u1.setName("u1");
    const u2 = new cellml.Units();
    u2.setName("u2");
    const res = new cellml.Units().compatible(u1, u2);
    assert.strictEqual(res, true);
  });
});
