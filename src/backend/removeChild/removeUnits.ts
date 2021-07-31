import { Model, Parser, Printer } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { EditorElement } from "../../types/EditorElement";
import { generateModel } from "../addChild/generateModel";

// Removes Units from model
// @fm - State management of model
// @child - Identifies Units to be removed by name
const removeUnits = async (fm: FileManagement, child: ISearch) => {
  const libcellml = fm._cellml;
  const m: Model = generateModel(libcellml, fm.getContent());
  const name = child.name;

  // Remove component in editor
  const removed = m.removeUnitsByName(name);
  if (!removed) {
    console.log("Failed to remove Units");
  }
  await fm.updateContent(fm._printer.printModel(m, false));

  // Remove component in properties
  let curElm = fm.getCurrentComponent() as Model;
  curElm.removeUnitsByName(name);

  fm.setCurrentComponent(curElm as EditorElement, fm.type);
};

export { removeUnits };
