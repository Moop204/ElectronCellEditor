import { Elements } from "../../types/Elements";
import { ChildDetail } from "../../types/ChildDetail";
import { Model, Parser, Reset } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";

const AddChildUnit = async (
  fm: FileManagement,
  child: ChildDetail,
  parent: ISearch
) => {
  const libcellml = fm._cellml;
  const printer = new libcellml.Printer();
  const parser: Parser = new libcellml.Parser();
  const { prefix, multiplier, exponent, units } = child.attribute;
  console.log(parent);
  // Make reset element
  const m: Model = parser.parseModel(fm.getContent());

  // Find the units
  // NOTE: Valid variables are within the same component
  const parentUnits = m.unitsByName(parent.name as string);

  console.log("PRE");
  for (let i = 0; i < parentUnits.unitCount(); i++) {
    console.log(parentUnits.unitAttributeReference(i));
  }

  parentUnits.removeUnitByReference(units);

  if (prefix === "") {
    parentUnits.addUnitByReferenceExponent(
      units,
      exponent === "" ? 1.0 : parseFloat(exponent),
      units
    );
  } else {
    parentUnits.addUnitByReferenceStringPrefix(
      units,
      prefix,
      exponent === "" ? 1.0 : parseFloat(exponent),
      multiplier === "" ? 1.0 : parseFloat(multiplier),
      units
    );
  }

  console.log("POST");
  for (let i = 0; i < parentUnits.unitCount(); i++) {
    console.log(parentUnits.unitAttributeReference(i));
  }

  // Attach it to parent component
  // parentComponent.addReset(newReset);
  // m.replaceComponentByName(
  //   parent.name as string,
  //   parentComponent.clone(),
  //   true
  // );
  m.replaceUnitsByName(parent.name as string, parentUnits);
  await fm.updateContent(printer.printModel(m, false));

  // Update current element
  fm.setCurrentComponent(parentUnits.clone(), Elements.units);
};

export { AddChildUnit };
