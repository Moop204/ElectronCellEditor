import { Component, Printer } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { EditorElement } from "../../types/EditorElement";
import { generateModel } from "../addChild/generateModel";

// Removes Variable from Component
// @fm - State management of model
// @child - Identifies Variable to be removed by name
const removeVariable = async (fm: FileManagement, child: ISearch) => {
  const printer: Printer = new fm._cellml.Printer();
  const m = generateModel(fm._cellml, fm.getContent());
  const name = child.name;

  // Remove element in properties
  let curElm = fm.getCurrentComponent() as Component;
  const componentName = curElm.name();
  curElm.removeVariableByName(name);

  // Remove element in editor
  const removed = m
    .componentByName(componentName, true)
    .removeVariableByName(name);
  if (!removed) {
    console.log("Failed to remove Variable");
  }
  await fm.updateContent(printer.printModel(m, false));
  fm.setCurrentComponent(curElm as EditorElement, fm.type);
};

export { removeVariable };
