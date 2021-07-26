import {
  Component,
  ComponentEntity,
  ImportSource,
  Model,
  Parser,
  Printer,
  Units,
} from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { EditorElement } from "../../types/EditorElement";

// Removes a Unit element from the currently selected Units
// @fm - Manages the state of the file
// @child - Identifies parent Units name as well as reset index

const RemoveUnit = async (fm: FileManagement, child: ISearch) => {
  console.log("Removing Reset");
  const libcellml = fm._cellml;
  const printer: Printer = new libcellml.Printer();
  const parser: Parser = new libcellml.Parser();
  const m: Model = parser.parseModel(fm.getContent());
  const name = child.index;
  const index = child.index;

  // Remove element in properties
  let curElm = fm.getCurrentComponent() as Units;
  const componentName = curElm.name();
  curElm.removeUnitByIndex(index);

  // Remove element in editor
  m.unitsByName(componentName).removeUnitByIndex(index);
  await fm.updateContent(printer.printModel(m, false));

  fm.setCurrentComponent(curElm as EditorElement, fm.type);
};

export { RemoveUnit };
