import { ICurrentElement } from '../../../types/ICurrentElement';
import { Model, Component, Variable } from '../../../types/ILibcellml';
import { ISearch } from '../../../types/IQuery';

const updateNameOfVariable = (
  model: Model,
  parentSelect: ISearch,
  currentElement: ICurrentElement,
  select: ISearch,
  value: string
) => {
  const modelCopy = model.clone();
  const c: Component = modelCopy.componentByName(
    parentSelect.name as string,
    true
  );
  const v: Variable = c.variableByName(select.name as string);
  v.setName(value);
  (currentElement as Variable).setName(value);
  const editedModel = modelCopy;
  const editedCurrentElement = currentElement;
  return { editedModel, editedCurrentElement };
};

export { updateNameOfVariable };
