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
// model => the complete cellml file as a model
// element => the type of element where math is being updated on
// parentSelect => identifying the parental element of the current element
// value => value that the math attribute will be replace with
// currentElement => the currently selected element
const updateMath = (
  model: Model,
  element: Elements,
  select: ISearch,
  value: any,
  currentElement: EditorElement
) => {
  switch (element) {
    case Elements.component:
      const componentElement = model.componentByName(
        select.name as string,
        true
      );
      console.log("New Math is ");
      console.log(value);
      componentElement.setMath(value);
      // model.replaceComponentByName(
      //   select.name as string,
      //   componentElement,
      //   true
      // );

      // if (currentElement === null) {
      //   console.log("FM: CurrentComponent is null when setting name");
      // } else {
      //   (currentElement as Component).setMath(value);
      // }
      currentElement = componentElement;

      break;
    // case Elements.model:
    //   model.setName(value);
    //   break;
    // case Elements.variable:
    //   model
    //     .takeComponentByName(parentSelect.name as string, true)
    //     .takeVariableByName(select.name as string)
    //     .setName(value);
    //   break;
    // case Elements.units:
    //   model.takeUnitsByName(select.name as string).setName(value);
    //   break;
    default:
      console.log(`UPDATE ATTRIBUTE: Failed to identify element ${element}`);
  }
  const newModel = model;
  const newCurrentElement = currentElement;

  console.log("Resulting model name " + newModel.name());
  return { newModel, newCurrentElement };
};

export { updateMath };
