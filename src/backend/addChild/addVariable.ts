import { Elements } from "../../types/Elements";
import { ChildVariableDetail } from "../../types/ChildDetail";
import { Component, Variable } from "../../types/ILibcellml";
import FileManagement from "../FileManagement";

// Add a Variable to the currently selected element Component.
// @fm - Manages the model of the program
// @child - Describes details of the new Variable
const addVariable = async (fm: FileManagement, child: ChildVariableDetail) => {
  const m = fm.parseModel(fm.getContent());
  const parentName = (fm.getCurrent() as Component).name();

  const { name, varInterface, initialValue, units } = child.attribute;

  const newVariable = fm._processor.buildVariable(
    name,
    units,
    varInterface,
    initialValue
  );

  // Add to Model
  const parentComponent = m.componentByName(parentName as string, true);
  parentComponent.addVariable(newVariable);

  // TODO: Check if this is necessary, may not need to replace
  m.replaceComponentByName(parentName as string, parentComponent, true);
  await fm.updateContent(fm.displayModel(m));

  // Add to cur elm
  fm.setCurrent(parentComponent, Elements.component);
};

export { addVariable };
