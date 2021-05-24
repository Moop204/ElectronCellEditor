/* eslint-disable no-case-declarations */
import { Elements } from '../../types/Elements';
import {
  Model,
  Reset,
  Units,
  Variable,
  Component,
} from '../../types/ILibcellml';
import { ISearch } from '../../types/IQuery';

// Definitely name attribute search
const updateName = (
  model: Model,
  element: Elements,
  select: ISearch,
  parentSelect: ISearch,
  value: any,
  currentElement: Component | Model | Reset | Units | Variable | null
) => {
  console.log(`FILEMANAGEMENT: Finding ${select.name}`);

  // Modify model
  // and current component parallel
  const modelCopy = model.clone();

  switch (element) {
    case Elements.component:
      console.log('COMPONENT');
      console.log(`Looking for ${select.name}`);

      const componentElement = modelCopy.takeComponentByName(
        select.name as string,
        true
      );

      if (componentElement === null) {
        console.log('FM Error: Component Element is null');
      }
      componentElement.setName(value);
      model.replaceComponentByName(
        select.name as string,
        componentElement,
        true
      );
      if (currentElement === null) {
        console.log('FM: CurrentComponent is null when setting name');
      } else {
        (currentElement as Component).setName(value);
      }
      break;
    case Elements.model:
      model.setName(value);
      break;
    case Elements.variable:
      model
        .takeComponentByName(parentSelect.name as string, true)
        .takeVariableByName(select.name as string)
        .setName(value);
      break;
    case Elements.units:
      const selectedUnit = modelCopy.takeUnitsByName(select.name as string);
      selectedUnit.setName(value);
      model.replaceUnitsByName(select.name as string, selectedUnit);
      console.log('AIYA');
      console.log(model);
      break;
    default:
      console.log(`UPDATE ATTRIBUTE: Failed to identify element ${element}`);
  }
  const newModel = model;
  return { newModel, currentElement };
};

export default updateName;
