/* eslint-disable no-case-declarations */
import { Elements } from '../../types/Elements';
import { ICurrentElement } from '../../types/ICurrentElement';
import {
  Model,
  Reset,
  Units,
  Variable,
  Component,
} from '../../types/ILibcellml';
import { ISearch } from '../../types/IQuery';

// Definitely name attribute search
const updateUnits = (
  model: Model,
  element: Elements,
  select: ISearch,
  parentSelect: ISearch,
  value: any,
  currentElement: ICurrentElement
) => {
  const modelCopy = model.clone();
  switch (element) {
    case Elements.variable:
      const parentElement = modelCopy.takeComponentByName(
        parentSelect.name as string,
        true
      );
      const componentElement = parentElement.takeVariableByName(
        select.name as string
      );
      componentElement.setUnitsByName(value);
      model.replaceComponentByName(select.name as string, parentElement, true);

      if (currentElement === null) {
        console.log('FM: CurrentComponent is null when setting name');
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

export default updateUnits;
