/* eslint-disable no-case-declarations */
import { Elements } from "../../types/Elements";
import { EditorElement } from "../../types/EditorElement";
import { Model, Variable, Component } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";

// Changes initial value of a Variable
// @model - Complete CellML data structure
// @element - Type of currently selected data structure
// @select - Means of searching model to find variable
// @currentElement - Currently selected element
const updateInitialValue = (
  model: Model,
  element: Elements,
  select: ISearch,
  value: any,
  currentElement: EditorElement
) => {
  const parentName = (currentElement?.parent() as Component).name();
  switch (element) {
    case Elements.variable:
      // Obtain element
      const parentElement = model.componentByName(parentName, true);
      const variableElement = parentElement.takeVariableByName(
        select.name as string
      );

      // Change
      variableElement.setInitialValueByString(value.toString());

      // Integrate change to model
      parentElement.addVariable(variableElement);
      model.replaceComponentByName(parentName, parentElement, true);

      if (currentElement === null) {
        console.log("FM: CurrentComponent is null when setting name");
      } else {
        (currentElement as Variable).setInitialValueByString(value.toString());
      }

      break;
    default:
      break;
  }
  const newModel = model;
  const newCurrentElement = currentElement;
  return { newModel, newCurrentElement };
};

export { updateInitialValue };
