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

const RemoveComponent = async (fm: FileManagement, child: ISearch) => {
  console.log("Removing component");
  const libcellml = fm._cellml;
  const printer: Printer = new libcellml.Printer();
  const parser: Parser = new libcellml.Parser();
  const m: Model = parser.parseModel(fm.getContent());
  const name = child.name;

  // Remove component in editor
  const removed = m.removeComponentByName(name, true);
  if (!removed) {
    console.log("PROBLEMO REMOVIN");
  }
  console.log("Removing " + name);
  console.log(printer.printModel(m, false));
  await fm.updateContent(printer.printModel(m, false));

  // Remove component in properties
  let curElm = fm.getCurrentComponent() as Component | Model;
  curElm = curElm.clone();
  curElm.removeComponentByName(name, false);

  fm.setCurrentComponent(curElm as EditorElement, fm.type);
};

export { RemoveComponent };
