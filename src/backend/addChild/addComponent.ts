import { Elements } from "../../types/Elements";
import { ChildComponentDetail } from "../../types/ChildDetail";
import { Component, ImportSource, Model } from "../../types/ILibcellml";
import FileManagement from "../FileManagement";
import { generateModel } from "./generateModel";
import { modelToString } from "./modelToString";

// Add a Component to the currently selected element (Model, Component).
// @fm - Manages the model of the program
// @parentType - Identifies type of element that component is added to
// @child - Describes details of the new component
const addComponent = async (
  fm: FileManagement,
  parentType: Elements,
  child: ChildComponentDetail
) => {
  const m = fm.parseModel(fm.getContent());
  const { name, imported, source, component_ref } = child.attribute;
  const newComponent = fm._processor.buildComponent(
    name,
    source,
    component_ref
  );

  // Update current component and model, either a Model or a Component
  if (parentType === Elements.model) {
    fm._processor.addComponent(m, newComponent);
    fm.setCurrent(m, Elements.model);
  } else {
    const parentName = (fm.getCurrent() as Model | Component).name();
    const parentComponent = fm._processor.findComponent(m, parentName);
    fm._processor.addComponent(parentComponent, newComponent);
    const curComp = fm._processor.findComponent(m, parentName);
    fm.setCurrent(curComp, Elements.component);
  }
  await fm.updateContent(fm.displayModel(m));
};

export { addComponent };
