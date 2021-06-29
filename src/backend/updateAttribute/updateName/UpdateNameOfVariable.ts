import { EditorElement } from "../../../types/EditorElement";
import { Model, Component, Variable } from "../../../types/ILibcellml";
import { ISearch } from "../../../types/IQuery";

const updateNameOfVariable = (
  model: Model,
  currentElement: EditorElement,
  select: ISearch,
  value: string
) => {
  const modelCopy = model.clone();
  console.log("NAME O VARS ");
  console.log(currentElement);
  const parentName = (currentElement?.parent() as Component).name();
  const c: Component = modelCopy.componentByName(parentName, true);
  const v: Variable = c.variableByName(select.name as string);
  v.setName(value);
  (currentElement as Variable).setName(value);
  const editedModel = modelCopy;
  const editedCurrentElement = currentElement;
  return { editedModel, editedCurrentElement };
};

export { updateNameOfVariable };
