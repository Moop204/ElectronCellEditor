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

// Changes the currentElement's interface attribute into the value specified by
// Presumptions: All values are of values:
//    - public
//    - none
//    - private
//    - public_and_private
const updateInterface = (
  model: Model,
  element: Elements,
  select: ISearch,
  value: any,
  currentElement: Variable
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
      variableElement.setInterfaceTypeByString(value);

      // Integrate change to model
      parentElement.addVariable(variableElement);
      model.replaceComponentByName(parentName, parentElement, true);

      if (currentElement === null) {
        console.log("FM: CurrentComponent is null when setting name");
      } else {
        (currentElement as Variable).setInterfaceTypeByString(value);
      }
      break;
    default:
      break;
  }
  const newModel = model;
  const newCurrentElement = currentElement;
  return { newModel, newCurrentElement };
};

export { updateInterface };
