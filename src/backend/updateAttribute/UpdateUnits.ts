/* eslint-disable no-case-declarations */
import { Elements } from "../../types/Elements";
import { EditorElement } from "../../types/EditorElement";
import {
  Model,
  Reset,
  Units,
  Variable,
  Component,
  NamedEntity,
} from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";

// Definitely name attribute search
const updateUnits = (
  model: Model,
  element: Elements,
  select: ISearch,
  value: any,
  currentElement: EditorElement
) => {
  const parentName = (currentElement?.parent() as NamedEntity).name();
  switch (element) {
    case Elements.variable:
      const parentElement = model.componentByName(parentName, true);
      const variableElement = parentElement.takeVariableByName(
        select.name as string
      );
      variableElement.setUnitsByName(value);
      parentElement.addVariable(variableElement);

      model.replaceComponentByName(parentName as string, parentElement, true);

      if (currentElement === null) {
        console.log("FM: CurrentComponent is null when setting name");
      } else {
        (currentElement as Variable).setUnitsByName(value);
      }
      break;
    default:
      break;
  }
  const newModel = model;
  const newCurrentElement = currentElement;
  return { newModel, newCurrentElement };
};

export { updateUnits };
