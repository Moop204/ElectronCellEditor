import { Component, Model, Parser, Printer } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { EditorElement } from "../../types/EditorElement";

// Removes a Reset element from the currently selected Component
// @fm - Manages the state of the file
// @child - Identifies parent component name as well as reset index

const RemoveReset = async (fm: FileManagement, child: ISearch) => {
  console.log("Removing Reset");
  const libcellml = fm._cellml;
  const printer: Printer = new libcellml.Printer();
  const parser: Parser = new libcellml.Parser();
  const m: Model = parser.parseModel(fm.getContent());
  const index = child.index;

  // Remove element in properties
  let curElm = fm.getCurrentComponent() as Component;
  const componentName = curElm.name();
  curElm = curElm.clone();
  curElm.removeResetByIndex(index);

  // Remove element in editor
  m.componentByName(componentName, true).removeResetByIndex(index);
  await fm.updateContent(printer.printModel(m, false));

  fm.setCurrentComponent(curElm as EditorElement, fm.type);
};

export { RemoveReset };
