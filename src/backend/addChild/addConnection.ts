import { Elements } from "../../types/Elements";
import {
  ChildConnectionDetail,
  ChildUnitsDetail,
} from "../../types/ChildDetail";
import { Units, ImportSource, Variable } from "../../types/ILibcellml";
import FileManagement from "../FileManagement";
import { generateModel } from "./generateModel";
import { modelToString } from "./modelToString";

// Add a new Connection between two Variables
// @fm - Manages the model of the program
// @child - Describes details of the new component
const addConnection = async (
  fm: FileManagement,
  child: ChildConnectionDetail
) => {
  const { component1, component2, variable1, variable2 } = child.attribute;
  // Initialised by caller
  const m = fm.parseModel(fm.getContent());

  // Identify the first and second variables
  const parentComp1 = m.componentByName(component1, true);
  const var1 = parentComp1.variableByName(variable1);

  const parentComp2 = m.componentByName(component2, true);
  const var2 = parentComp2.variableByName(variable2);

  // Update the state

  const id = component1 + variable1 + "_" + component2 + variable2;
  fm._processor.addEquivalence(var1, var2, "map_" + id, "connect_" + id);

  fm.setCurrentComponent(fm.getCurrentComponent());
  await fm.updateContent(fm.displayModel(m));
};

export { addConnection };
