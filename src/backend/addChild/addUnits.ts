import { Elements } from "../../types/Elements";
import { ChildUnitsDetail } from "../../types/ChildDetail";
import FileManagement from "../FileManagement";

// Add a Units to the currently selected Model.
// @fm - Manages the model of the program
// @child - Describes details of the new component
const addUnits = async (fm: FileManagement, child: ChildUnitsDetail) => {
  const { name, imported, source, component_ref } = child.attribute;

  // Initialised by caller
  const m = fm.parseModel(fm.getContent());

  // Make new element with attributes specified by user
  const newUnits = fm._processor.buildUnits(
    name,
    imported,
    source,
    component_ref
  );

  // Get the truth and update it
  m.addUnits(newUnits);
  fm.setCurrentComponent(m, Elements.model);
  await fm.updateContent(fm.displayModel(m));
};

export { addUnits };
