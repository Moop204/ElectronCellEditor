import { Model, Parser, Printer } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { EditorElement } from "../../types/EditorElement";

// Removes Units from model
// @fm - State management of model
// @child - Identifies Units to be removed by name
const RemoveUnits = async (fm: FileManagement, child: ISearch) => {
  console.log("Removing Units");
  const libcellml = fm._cellml;
  const printer: Printer = new libcellml.Printer();
  const parser: Parser = new libcellml.Parser();
  const m: Model = parser.parseModel(fm.getContent());
  const name = child.name;

  // Remove component in editor
  const removed = m.removeUnitsByName(name);
  if (!removed) {
    console.log("Failed to remove Units");
  }
  await fm.updateContent(printer.printModel(m, false));

  // Remove component in properties
  let curElm = fm.getCurrentComponent() as Model;
  curElm.removeUnitsByName(name);

  fm.setCurrentComponent(curElm as EditorElement, fm.type);
};

export { RemoveUnits };
