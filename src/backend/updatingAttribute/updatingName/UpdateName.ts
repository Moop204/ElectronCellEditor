/* eslint-disable no-case-declarations */
import { Elements } from '../../../types/Elements';
import { ICurrentElement } from '../../../types/ICurrentElement';
import {
  Model,
  Reset,
  Units,
  Variable,
  Component,
} from '../../../types/ILibcellml';
import { ISearch } from '../../../types/IQuery';
import { updateNameOfComponent } from './UpdateNameOfComponent';
import { updateNameOfModel } from './UpdateNameOfModel';
import { updateNameOfUnits } from './updateNameOfUnits';
import { updateNameOfVariable } from './UpdateNameOfVariable';

// Definitely name attribute search
const updateName = (
  model: Model,
  element: Elements,
  select: ISearch,
  parentSelect: ISearch,
  value: string,
  currentElement: ICurrentElement
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
      parentSelect,
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

export default updateName;
