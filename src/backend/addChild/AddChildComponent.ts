import { Elements } from "../../types/Elements";
import { ChildDetail } from "../../types/ChildDetail";
import { Component, ImportSource, Model } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { generateModel } from "./generateModel";
import { modelToString } from "./modelToString";

// Responsibility: Add a Component to the currently selected element (Model, Component).
// @fm - Manages the model of the program
// @parent -
const AddChildComponent = async (
  fm: FileManagement,
  parent: ISearch,
  parentType: Elements,
  child: ChildDetail
) => {
  const libcellml = fm._cellml;
  const m = generateModel(fm._cellml, fm.getContent());
  const { name, imported, source, component_ref } = child.attribute;

  // Create new component
  const newComp: Component = new libcellml.Component();
  newComp.setName(name as string);
  if (imported) {
    const importSource: ImportSource = new libcellml.ImportSource();
    importSource.setUrl(source);
    newComp.setSourceComponent(importSource, component_ref);
  }

  // Update current component
  // (this.currentComponent as Model | Component).addComponent(newComp);
  // Update the truth
  if (parentType === Elements.model) {
    m.addComponent(newComp);
    fm.setCurrentComponent(m.clone(), Elements.model);
  } else {
    const parentName = (fm.getCurrentComponent() as Model | Component).name();
    const parentComponent = m.componentByName(parentName, true);
    parentComponent.addComponent(newComp);
    m.replaceComponentByName(parentName as string, parentComponent, true);

    const curComp = m.componentByName(parentName as string, true);
    fm.setCurrentComponent(curComp, Elements.component);
  }
  await fm.updateContent(modelToString(libcellml, m));
};

export { AddChildComponent };
