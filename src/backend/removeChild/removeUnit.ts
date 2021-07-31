import { Model, Units } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { EditorElement } from "../../types/EditorElement";

// Removes a Unit element from the currently selected Units
// @fm - Manages the state of the file
// @child - Identifies parent Units name as well as reset index
const removeUnit = async (fm: FileManagement, child: ISearch) => {
  const libcellml = fm._cellml;
  const m: Model = fm._parser.parseModel(fm.getContent());
  const index = child.index;

  // Remove element in properties
  let curElm = fm.getCurrentComponent() as Units;
  const componentName = curElm.name();
  const removed = curElm.removeUnitByIndex(index);
  if (!removed) {
    console.log(`Failed to remove Unit at index ${index}.`);
  }
  // Remove element in editor
  m.unitsByName(componentName).removeUnitByIndex(index);
  await fm.updateContent(fm._printer.printModel(m, false));

  fm.setCurrentComponent(curElm as EditorElement, fm.type);
};

export { removeUnit };
