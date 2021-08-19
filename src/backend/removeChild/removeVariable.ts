import { Component, Printer } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { EditorElement } from "../../types/EditorElement";
import { generateModel } from "../addChild/generateModel";

// Removes Variable from Component
// @fm - State management of model
// @child - Identifies Variable to be removed by name
const removeVariable = async (fm: FileManagement, child: ISearch) => {
  const m = fm.parseModel(fm.getContent());
  const name = child.name;

  // Remove element in properties
  let curElm = fm.getCurrent() as Component;
  const componentName = curElm.name();
  curElm.removeVariableByName(name);

  // Remove element in editor
  const removed = m
    .componentByName(componentName, true)
    .removeVariableByName(name);
  if (!removed) {
    console.log("Failed to remove Variable");
  }
  await fm.updateContentFromModel(m);
  fm.setCurrent(curElm as EditorElement);
};

export { removeVariable };
