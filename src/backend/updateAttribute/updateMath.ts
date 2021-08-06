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

// Changes the Math child of a Component element
// @model - The complete cellml file as a model
// @element - The type of element where math is being updated on
// @parentSelect - Identifying the parental element of the current element
// @value - Value that the math attribute will be replace with
// @currentElement - The currently selected element
const updateMath = (
  model: Model,
  element: Elements,
  select: ISearch,
  value: any,
  currentElement: EditorElement
) => {
  console.log("This is math model");
  console.log(model);
  switch (element) {
    case Elements.component:
      const componentElement = model.componentByName(
        select.name as string,
        true
      );
      componentElement.setMath(value);
      currentElement = componentElement;

      break;
    default:
      console.log(`UPDATE ATTRIBUTE: Failed to identify element ${element}`);
  }
  const newModel = model;
  const newCurrentElement = currentElement;
  return { newModel, newCurrentElement };
};

export { updateMath };
