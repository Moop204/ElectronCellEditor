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

// Definitely name attribute search
const updateInitialValue = (
  model: Model,
  element: Elements,
  select: ISearch,
  value: any,
  currentElement: EditorElement
) => {
  const modelCopy = model.clone();
  const parentName = (currentElement?.parent() as Component).name();
  switch (element) {
    case Elements.variable:
      // Obtain element
      const parentElement = modelCopy.takeComponentByName(parentName, true);
      const variableElement = parentElement.takeVariableByName(
        select.name as string
      );

      // Change
      console.log("Update Initial Value");
      console.log(value);
      variableElement.setInitialValueByString(value.toString());

      // Integrate change to model
      parentElement.addVariable(variableElement);
      model.replaceComponentByName(parentName as string, parentElement, true);

      console.log("Initial Value log");
      console.log(select.name);
      console.log(variableElement.name());

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
