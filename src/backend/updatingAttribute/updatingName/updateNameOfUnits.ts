import { ICurrentElement } from '../../../types/ICurrentElement';
import { Model, Units } from '../../../types/ILibcellml';
import { ISearch } from '../../../types/IQuery';

const updateNameOfUnits = (
  model: Model,
  select: ISearch,
  currentElement: ICurrentElement,
  value: string
) => {
  const modelCopy = model.clone();
  const selectedUnit = modelCopy.unitsByName(select.name as string);
  selectedUnit.setName(value);
  modelCopy.replaceUnitsByName(select.name as string, selectedUnit);
  (currentElement as Units).setName(value);
  const editedModel = modelCopy;
  const editedCurrentElement = currentElement;
  return { editedModel, editedCurrentElement };
};

export { updateNameOfUnits };
