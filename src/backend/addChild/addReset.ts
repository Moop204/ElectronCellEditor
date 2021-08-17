import { Elements } from "../../types/Elements";
import { ChildResetDetail } from "../../types/ChildDetail";
import { Component, Reset, Variable } from "../../types/ILibcellml";
import FileManagement from "../FileManagement";

// Add a Reset to the currently selected Component.
// @fm - Manages the model of the program
// @child - Describes details of the new component
const addReset = async (fm: FileManagement, child: ChildResetDetail) => {
  const { reset_variable, test_variable, order, reset_value, test_value } =
    child.attribute;
  const m = fm.parseModel(fm.getContent());

  // Find the variables
  // NOTE: Valid variables are within the same component
  const parentName = (fm.getCurrentComponent() as Component).name();
  const parentComponent = m.componentByName(parentName as string, true);
  const v = parentComponent.variableByName(reset_variable);
  const vTest = parentComponent.variableByName(test_variable);

  const newReset = fm._processor.buildReset(
    v,
    vTest,
    order,
    reset_value,
    test_value
  );
  m.componentByName(parentName as string, true).addReset(newReset);

  await fm.updateContent(fm.displayModel(m));

  // Update current element
  fm.setCurrentComponent(parentComponent.clone(), Elements.component);
};

export { addReset };
