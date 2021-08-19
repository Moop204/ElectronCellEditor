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
  // const removed = m.removeComponentByName(name, true);
  // if (!removed) {
  //   console.log("Failed to remove Component");
  // }
  fm._processor.removeComponent(m, name);

  await fm.updateContentFromModel(m);

  // Remove component in properties
  let curElm = fm.getCurrent() as Component | Model;
  const currentName = curElm.name();
  if (m.name() === currentName) {
    curElm = m;
  } else {
    curElm = fm._processor.findComponent(m, name);
    fm._processor.removeComponent(curElm, name);
  }

  fm.setCurrent(curElm as EditorElement);
};

export { removeComponent };
