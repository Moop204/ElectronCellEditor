import { Model, Units } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { EditorElement } from "../../types/EditorElement";

// Removes a Unit element from the currently selected Units
// @fm - Manages the state of the file
// @child - Identifies parent Units name as well as reset index
const removeUnit = async (fm: FileManagement, child: ISearch) => {
  const m: Model = fm.parseModel(fm.getContent());
  const index = child.index;

  // Remove element in properties
  let curElm = fm.getCurrent() as Units;
  const componentName = curElm.name();
  const removed = curElm.removeUnitByIndex(index);
  if (!removed) {
    console.log(`Failed to remove Unit at index ${index}.`);
  }
  // Remove element in editor
  m.unitsByName(componentName).removeUnitByIndex(index);
  await fm.updateContentFromModel(m);

  fm.setCurrent(curElm as EditorElement);
};

export { removeUnit };
