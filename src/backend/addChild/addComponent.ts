import { Elements } from "../../types/Elements";
import { ChildComponentDetail } from "../../types/ChildDetail";
import { Component, ImportSource, Model } from "../../types/ILibcellml";
import FileManagement from "../FileManagement";
import { generateModel } from "./generateModel";
import { modelToString } from "./modelToString";

// Creates a component
const makeComponent = (
  fm: FileManagement,
  name: string,
  imported: boolean,
  source: string,
  component_ref: string
): Component => {
  const libcellml = fm._cellml;
  const newComp: Component = new libcellml.Component();
  newComp.setName(name as string);
  if (imported) {
    const importSource: ImportSource = new libcellml.ImportSource();
    importSource.setUrl(source);
    newComp.setSourceComponent(importSource, component_ref);
  }
  return newComp;
};

// Add a Component to the currently selected element (Model, Component).
// @fm - Manages the model of the program
// @parentType - Identifies type of element that component is added to
// @child - Describes details of the new component
const addComponent = async (
  fm: FileManagement,
  parentType: Elements,
  child: ChildComponentDetail
) => {
  const libcellml = fm._cellml;
  const m = generateModel(fm._cellml, fm.getContent());
  const { name, imported, source, component_ref } = child.attribute;
  const newComponent = makeComponent(fm, name, imported, source, component_ref);

  // Update current component and model, either a Model or a Component
  if (parentType === Elements.model) {
    m.addComponent(newComponent);
    fm.setCurrentComponent(m, Elements.model);
  } else {
    const parentName = (fm.getCurrentComponent() as Model | Component).name();
    const parentComponent = m.componentByName(parentName, true);
    parentComponent.addComponent(newComponent);
    const curComp = m.componentByName(parentName as string, true);
    fm.setCurrentComponent(curComp, Elements.component);
  }
  await fm.updateContent(modelToString(libcellml, m));
};

export { addComponent };
