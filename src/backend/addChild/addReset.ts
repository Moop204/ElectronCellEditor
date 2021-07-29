import { Elements } from "../../types/Elements";
import { ChildResetDetail } from "../../types/ChildDetail";
import { Component, Reset, Variable } from "../../types/ILibcellml";
import FileManagement from "../FileManagement";
import { generateModel } from "./generateModel";
import { modelToString } from "./modelToString";

// Creates a Reset
const makeReset = (
  fm: FileManagement,
  v: Variable,
  order: number,
  vTest: Variable,
  reset_value: string,
  test_value: string
): Reset => {
  const libcellml = fm._cellml;
  // Detail Reset element
  // NOTE: All are mandatory
  const newReset: Reset = new libcellml.Reset();
  newReset.setVariable(v);
  newReset.setOrder(order);
  newReset.setTestVariable(vTest);
  newReset.setResetValue(reset_value);
  newReset.setTestValue(test_value);

  return newReset;
};

// Add a Reset to the currently selected Component.
// @fm - Manages the model of the program
// @child - Describes details of the new component
const addReset = async (fm: FileManagement, child: ChildResetDetail) => {
  const libcellml = fm._cellml;
  const { reset_variable, test_variable, order, reset_value, test_value } =
    child.attribute;
  const m = generateModel(fm._cellml, fm.getContent());

  // Find the variables
  // NOTE: Valid variables are within the same component
  const parentName = (fm.getCurrentComponent() as Component).name();
  const parentComponent = m.componentByName(parentName as string, true);
  const v = parentComponent.variableByName(reset_variable);
  const vTest = parentComponent.variableByName(test_variable);

  const newReset = makeReset(fm, v, order, vTest, reset_value, test_value);
  m.componentByName(parentName as string, true).addReset(newReset);

  await fm.updateContent(modelToString(libcellml, m));

  // Update current element
  fm.setCurrentComponent(parentComponent.clone(), Elements.component);
};

export { addReset };
