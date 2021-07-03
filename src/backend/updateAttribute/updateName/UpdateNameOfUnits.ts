import { EditorElement } from "../../../types/EditorElement";
import { Model, Units } from "../../../types/ILibcellml";
import { ISearch } from "../../../types/IQuery";

const updateNameOfUnits = (
  model: Model,
  select: ISearch,
  currentElement: EditorElement,
  value: string
) => {
  const selectedUnit = model.unitsByName(select.name as string);
  selectedUnit.setName(value);
  model.replaceUnitsByName(select.name as string, selectedUnit);
  (currentElement as Units).setName(value);
  const editedModel = model;
  const editedCurrentElement = currentElement;
  return { editedModel, editedCurrentElement };
};

export { updateNameOfUnits };
