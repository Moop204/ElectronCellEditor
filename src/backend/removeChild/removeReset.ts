import { Component, Model, Parser, Printer } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { EditorElement } from "../../types/EditorElement";

// Removes a Reset element from the currently selected Component
// @fm - Manages the state of the file
// @child - Identifies parent component name as well as reset index

const removeReset = async (fm: FileManagement, child: ISearch) => {
  console.log("Removing Reset");

  const m: Model = fm.parseModel(fm.getContent());
  const index = child.index;

  // Remove element in properties
  let curElm = fm.getCurrent() as Component;
  const componentName = curElm.name();
  // curElm = curElm.clone();
  curElm.removeResetByIndex(index);

  // Remove element in editor
  m.componentByName(componentName, true).removeResetByIndex(index);
  await fm.updateContentFromModel(m);

  fm.setCurrent(curElm as EditorElement);
};

export { removeReset };
