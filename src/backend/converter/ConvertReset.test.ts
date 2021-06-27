import FileManagement from "../FileManagement";

const libcellModule = require("libcellml.js/libcellml.common");

describe("Converting resets", () => {
  test("accessing variables", async () => {
    const libcellml = await libcellModule();
    const m = new libcellml.Model();
    const p = new libcellml.Printer();
    m.setName("testModel");
    const componentParent = new libcellml.Component();
    componentParent.setName("testComponent1");
    m.addComponent(componentParent);
    const var1 = new libcellml.Variable();
    var1.setName("variable1");
    var1.setUnitsByName("second");
    componentParent.addVariable(var1);
    const newReset = new libcellml.Reset();
    newReset.setVariable(var1);
    newReset.setOrder(5);
    newReset.setTestVariable(var1);
    newReset.setResetValue(`<math xmlns="http://www.w3.org/1998/Math/MathML">
  <ci>x</ci>
</math>`);
    newReset.setTestValue(`<math xmlns="http://www.w3.org/1998/Math/MathML">
  <ci>x</ci>
</math>`);

    const fm = new FileManagement();
    await fm.init();

    console.log(newReset.variable());
  });
});
