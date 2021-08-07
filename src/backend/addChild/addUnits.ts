import { Elements } from "../../types/Elements";
import { ChildUnitsDetail } from "../../types/ChildDetail";
import { Units, ImportSource } from "../../types/ILibcellml";
import FileManagement from "../FileManagement";
import { generateModel } from "./generateModel";
import { modelToString } from "./modelToString";

// Create a Units element
// @fm            - State management
// @name          - Name of new component
// @imported      - Whether or not the new component is imported
// @source        - Location of file where component is imported from
// @component_ref - Name of Units in the source file that is being imported
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
const addUnits = async (fm: FileManagement, child: ChildUnitsDetail) => {
  const { name, imported, source, component_ref } = child.attribute;

  // Initialised by caller
  const libcellml = fm._cellml;
  const m = generateModel(libcellml, fm.getContent());

  // Make new element with attributes specified by user
  const newUnits = makeUnits(fm, name, imported, source, component_ref);

  // Get the truth and update it
  m.addUnits(newUnits);
  fm.setCurrentComponent(m, Elements.model);
  await fm.updateContent(modelToString(libcellml, m));
};

export { addUnits };
