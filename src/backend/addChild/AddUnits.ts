import { Elements } from "../../types/Elements";
import { ChildDetail, ChildUnitsDetail } from "../../types/ChildDetail";
import {
  Model,
  Units,
  Printer,
  Parser,
  ImportSource,
} from "../../types/ILibcellml";
import FileManagement from "../FileManagement";
import { generateModel } from "./generateModel";
import { modelToString } from "./modelToString";

// Create a Units element
const makeUnits = (
  fm: FileManagement,
  name: string,
  imported: boolean,
  source: string,
  component_ref: string
) => {
  const libcellml = fm._cellml;
  const newUnits: Units = new libcellml.Units();
  newUnits.setName(name as string);
  if (imported) {
    const importSource: ImportSource = new libcellml.ImportSource();
    importSource.setUrl(source);
    newUnits.setSourceUnits(importSource, component_ref);
  }
  return newUnits;
};

// Add a Units to the currently selected Model.
// @fm - Manages the model of the program
// @child - Describes details of the new component
const AddUnits = async (fm: FileManagement, child: ChildUnitsDetail) => {
  const { name, imported, source, component_ref } = child.attribute;

  // Initialised by caller
  const libcellml = fm._cellml;
  const m = generateModel(libcellml, fm.getContent());

  // Make new element with attributes specified by user
  const newUnits = makeUnits(fm, name, imported, source, component_ref);

  // Get the truth and update it
  m.addUnits(newUnits);
  fm.setCurrentComponent(m.clone(), Elements.model);
  await fm.updateContent(modelToString(libcellml, m));
};

export { AddUnits };
