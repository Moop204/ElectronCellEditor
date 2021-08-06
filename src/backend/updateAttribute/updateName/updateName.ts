/* eslint-disable no-case-declarations */
import { Elements } from "../../../types/Elements";
import { EditorElement } from "../../../types/EditorElement";
import { Model } from "../../../types/ILibcellml";
import { ISearch } from "../../../types/IQuery";
import { updateNameOfComponent } from "./updateNameOfComponent";
import { updateNameOfModel } from "./updateNameOfModel";
import { updateNameOfUnits } from "./updateNameOfUnits";
import { updateNameOfVariable } from "./updateNameOfVariable";

// Change the name of a named entity (Model, Component, Variable, Units)
const updateName = (
  model: Model,
  element: Elements,
  select: ISearch,
  value: string,
  currentElement: EditorElement
) => {
  // Modify model
  // and current component parallel
  let newModel;
  let newCurrentElement;

  if (element === Elements.component) {
    const { editedModel, editedCurrentElement } = updateNameOfComponent(
      model,
      select,
      currentElement,
      value
    );
    newModel = editedModel;
    newCurrentElement = editedCurrentElement;
  } else if (element === Elements.model) {
    const { editedModel, editedCurrentElement } = updateNameOfModel(
      model,
      currentElement as Model,
      value
    );
    newModel = editedModel;
    newCurrentElement = editedCurrentElement;
  } else if (element === Elements.variable) {
    const { editedModel, editedCurrentElement } = updateNameOfVariable(
      model,
      currentElement,
      select,
      value
    );
    newModel = editedModel;
    newCurrentElement = editedCurrentElement;
  } else if (element === Elements.units) {
    const { editedModel, editedCurrentElement } = updateNameOfUnits(
      model,
      select,
      currentElement,
      value
    );
    newModel = editedModel;
    newCurrentElement = editedCurrentElement;
  } else {
    newModel = model;
    newCurrentElement = currentElement;
    console.log(`UPDATE ATTRIBUTE: Failed to identify element ${element}`);
  }

  return { newModel, newCurrentElement };
};

export { updateName };
