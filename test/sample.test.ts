import React from "react";
import FileManagement from "../src/backend/FileManagement";

const libcellModule = require("libcellml.js/libcellml.common");

import assert from "assert";
import { Printer } from "../src/types/ILibcellml";

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
  it("makes filemanager", async () => {
    const fm = new FileManagement();
    await fm.init();
  });
});
