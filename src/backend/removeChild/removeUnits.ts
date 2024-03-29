import { Model, Parser, Printer } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { EditorElement } from "../../types/EditorElement";
import { generateModel } from "../addChild/generateModel";

// Removes Units from model
// @fm - State management of model
// @child - Identifies Units to be removed by name
const removeUnits = async (fm: FileManagement, child: ISearch) => {
  const m: Model = fm.parseModel(fm.getContent());
  const name = child.name;

  // Remove component in editor
  const removed = m.removeUnitsByName(name);
  if (!removed) {
    console.log("Failed to remove Units");
  }
  await fm.updateContentFromModel(m);

  // Remove component in properties
  let curElm = fm.getCurrent() as Model;
  curElm.removeUnitsByName(name);

  fm.setCurrent(curElm as EditorElement);
};

export { removeUnits };
