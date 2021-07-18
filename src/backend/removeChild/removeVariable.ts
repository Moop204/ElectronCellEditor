import {
  Component,
  ComponentEntity,
  ImportSource,
  Model,
  Parser,
  Printer,
} from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { EditorElement } from "../../types/EditorElement";

const RemoveVariable = async (fm: FileManagement, child: ISearch) => {
  console.log("Removing Variables");
  const libcellml = fm._cellml;
  const printer: Printer = new libcellml.Printer();
  const parser: Parser = new libcellml.Parser();
  const m: Model = parser.parseModel(fm.getContent());
  const name = child.name;

  // Remove element in properties
  let curElm = fm.getCurrentComponent() as Component;
  const componentName = curElm.name();
  curElm = curElm.clone();
  curElm.removeVariableByName(name);

  // Remove element in editor
  const removed = m
    .componentByName(componentName, true)
    .removeVariableByName(name);
  if (!removed) {
    console.log("PROBLEMO REMOVIN");
  }
  console.log("Removing " + name);
  console.log(printer.printModel(m, false));
  await fm.updateContent(printer.printModel(m, false));

  fm.setCurrentComponent(curElm as EditorElement, fm.type);
};

export { RemoveVariable };
