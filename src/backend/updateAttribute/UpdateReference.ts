/* eslint-disable no-case-declarations */
import { Elements } from "../../types/Elements";
import { EditorElement } from "../../types/EditorElement";
import { Model, Units } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";

// Changes the reference attribute of a Units element
// @model - The complete cellml file as a model
// @element - The type of element where math is being updated on
// @parentSelect - Identifying the parental element of the current element
// @value - Value that the math attribute will be replace with
// @currentElement - The currently selected Units
const updateReference = (
  model: Model,
  element: Elements,
  select: ISearch,
  value: any,
  currentElement: EditorElement
) => {
  const modelCopy = model.clone();

  switch (element) {
    case Elements.units:
      const unitsName = (currentElement as Units).name();
      const unitsElement = modelCopy.unitsByName(unitsName);
      const oldExponent = unitsElement.unitAttributeExponent(
        select.index as number
      );
      const oldPrefix = unitsElement.unitAttributePrefix(
        select.index as number
      );
      const oldMultiplier = unitsElement.unitAttributeMultiplier(
        select.index as number
      );

      // New unit
      unitsElement.removeUnitByIndex(select.index as number);
      unitsElement.removeUnitByReference(value);
      unitsElement.addUnitByReferenceStringPrefix(
        value,
        oldPrefix,
        oldExponent,
        oldMultiplier,
        value
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

export { updateReference };
