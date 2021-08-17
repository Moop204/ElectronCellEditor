import { Component, Model, Parser, Printer } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { EditorElement } from "../../types/EditorElement";

// Removes a Component from the currently selected Element (Model or Component)
// @fm - Manages state
// @child - Identifies the child to be removed
const removeComponent = async (fm: FileManagement, child: ISearch) => {
  const m: Model = fm.parseModel(fm.getContent());
  const name = child.name;

  // Remove component in editor
  const removed = m.removeComponentByName(name, true);
  if (!removed) {
    console.log("Failed to remove Component");
  }
  await fm.updateContentFromModel(m);

  // Remove component in properties
  let curElm = fm.getCurrentComponent() as Component | Model;
  //curElm = curElm.clone();
  curElm.removeComponentByName(name, false);

  fm.setCurrentComponent(curElm as EditorElement);
};

export { removeComponent };
