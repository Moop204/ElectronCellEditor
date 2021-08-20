import { Elements } from "../../types/Elements";
import { ChildUnitDetail } from "../../types/ChildDetail";
import { Units } from "../../types/ILibcellml";
import FileManagement from "../FileManagement";
import { generateModel } from "./generateModel";
import { modelToString } from "./modelToString";

// Add a Unit to the currently selected Units.
// @fm - Manages the model of the program
// @child - Describes details of the new component
const addUnit = async (fm: FileManagement, child: ChildUnitDetail) => {
  const { prefix, multiplier, exponent, units } = child.attribute;
  const m = fm.parseModel(fm.getContent());
  const parentName = (fm.getCurrent() as Units).name();

  // Find the units
  const parentUnits = m.unitsByName(parentName);

  fm._processor.addUnit(
    parentUnits,
    units,
    prefix,
    parseFloat(multiplier),
    parseFloat(exponent)
  );

  await fm.updateContentFromModel(m);
  // Update current element
  fm.setCurrent(parentUnits, Elements.units);
};

export { addUnit };
