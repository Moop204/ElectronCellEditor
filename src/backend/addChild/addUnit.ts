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
  const libcellml = fm._cellml;
  const { prefix, multiplier, exponent, units } = child.attribute;
  const m = generateModel(fm._cellml, fm.getContent());
  const parentName = (fm.getCurrentComponent() as Units).name();

  // Find the units
  const parentUnits = m.unitsByName(parentName);

  // Remove in case of duplication
  parentUnits.removeUnitByReference(units);

  if (prefix === "") {
    parentUnits.addUnitByReferenceExponent(
      units,
      exponent === "" ? 1.0 : parseFloat(exponent),
      [parentName, prefix, units, exponent, multiplier].join("_")
    );
  } else {
    parentUnits.addUnitByReferenceStringPrefix(
      units,
      prefix,
      exponent === "" ? 1.0 : parseFloat(exponent),
      multiplier === "" ? 1.0 : parseFloat(multiplier),
      [parentName, prefix, units, exponent, multiplier].join("_")
    );
  }

  await fm.updateContent(modelToString(libcellml, m));
  // Update current element
  fm.setCurrentComponent(parentUnits, Elements.units);
};

export { addUnit };
