import { Elements } from "../../types/Elements";
import { ChildVariableDetail } from "../../types/ChildDetail";
import { Component, Variable } from "../../types/ILibcellml";
import FileManagement from "../FileManagement";
import { generateModel } from "./generateModel";
import { modelToString } from "./modelToString";

// Create a new Variable
const makeVariable = (
  fm: FileManagement,
  name: string,
  varInterface: string,
  initialValue: string,
  units: string
): Variable => {
  const newVariable: Variable = new fm._cellml.Variable();
  newVariable.setName(name as string);
  newVariable.setUnitsByName(units as string);
  if (varInterface) {
    newVariable.setInterfaceTypeByString(varInterface);
  }
  if (initialValue) {
    newVariable.setInitialValueByString(initialValue as string);
  }
  return newVariable;
};

// Add a Variable to the currently selected element Component.
// @fm - Manages the model of the program
// @child - Describes details of the new Variable
const addVariable = async (fm: FileManagement, child: ChildVariableDetail) => {
  const libcellml = fm._cellml;
  const m = generateModel(fm._cellml, fm.getContent());
  const parentName = (fm.getCurrentComponent() as Component).name();

  const { name, varInterface, initialValue, units } = child.attribute;

  const newVariable = makeVariable(fm, name, varInterface, initialValue, units);

  // Add to Model
  const parentComponent = m.componentByName(parentName as string, true);
  parentComponent.addVariable(newVariable);

  // TODO: Check if this is necessary, may not need to replace
  m.replaceComponentByName(parentName as string, parentComponent, true);
  await fm.updateContent(modelToString(libcellml, m));

  // Add to cur elm
  fm.setCurrentComponent(parentComponent, Elements.component);
};

export { addVariable };
