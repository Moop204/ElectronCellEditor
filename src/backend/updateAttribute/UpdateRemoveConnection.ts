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
const updateRemoveConnection = (
  model: Model,
  element: Elements,
  select: ISearch,
  value: any, // Other Variable
  currentElement: EditorElement
) => {
  // Get current variable
  const variableName = (currentElement as Variable).name();
  const parentComponentName = (currentElement.parent() as Component).name();
  const component1 = model.componentByName(parentComponentName, true);
  const variable1 = component1.variableByName(variableName);

  // Get equivalent variable
  // Assumptions:
  // Name refers to name of component
  // Index refers to name of variable
  const { name, index } = select;
  const component2 = model.componentByName(value as string, true);
  const variable2 = component2.variableByName(name);

  variable1.removeEquivalence(variable1, variable2);

  const newModel = model;
  const newCurrentElement = currentElement;
  return { newModel, newCurrentElement };
};

export { updateRemoveConnection };
