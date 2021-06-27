/* eslint-disable no-case-declarations */
import { Elements } from "../../types/Elements";
import { EditorElement } from "../../types/EditorElement";
import {
  Model,
  Reset,
  Units,
  Variable,
  Component,
} from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";

// Definitely name attribute search
// model => the complete cellml file as a model
// element => the type of element where math is being updated on
// parentSelect => identifying the parental element of the current element
// value => value that the math attribute will be replace with
// currentElement => the currently selected element
const updatePrefix = (
  model: Model,
  element: Elements,
  select: ISearch,
  parentSelect: ISearch,
  value: any,
  currentElement: EditorElement,
  fm: FileManagement
) => {
  const modelCopy = model.clone();

  switch (element) {
    case Elements.units:
      const unitsName = (currentElement as Units).name();
      const unitsElement = modelCopy.unitsByName(unitsName);
      const oldExponent = unitsElement.unitAttributeExponent(
        select.index as number
      );
      const oldMultiplier = unitsElement.unitAttributeMultiplier(
        select.index as number
      );
      const oldReference = unitsElement.unitAttributeReference(
        select.index as number
      );

      const libcellml = fm._cellml;

      // New unit
      unitsElement.removeUnitByIndex(select.index as number);
      unitsElement.addUnitByReferenceStringPrefix(
        oldReference,
        value,
        oldExponent,
        oldMultiplier,
        oldReference
      );

      model.replaceUnitsByName(unitsName, unitsElement);

      if (currentElement === null) {
        console.log("FM: CurrentComponent is null when setting prefix");
      } else {
        currentElement = model.unitsByName(unitsName);
      }
      break;
    default:
      console.log(`UPDATE ATTRIBUTE: Failed to identify element ${element}`);
  }
  const newModel = model;
  const newCurrentElement = currentElement;
  return { newModel, newCurrentElement };
};

export { updatePrefix };
