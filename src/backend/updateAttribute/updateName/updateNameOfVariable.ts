import { EditorElement } from "../../../types/EditorElement";
import { Model, Component, Variable } from "../../../types/ILibcellml";
import { ISearch } from "../../../types/IQuery";

const updateNameOfVariable = (
  model: Model,
  currentElement: EditorElement,
  select: ISearch,
  value: string
) => {
  console.log("TEST DEBUG");
  console.log(currentElement);
  console.log(currentElement.parent());
  const parentName = (currentElement?.parent() as Component).name();

  const c: Component = model.componentByName(parentName, true);
  const v: Variable = c.takeVariableByName(select.name as string);
  v.setName(value);

  c.addVariable(v);
  model.replaceComponentByName(parentName, c, true);

  (currentElement as Variable).setName(value);
  const editedModel = model;
  const editedCurrentElement = v; //currentElement;
  return { editedModel, editedCurrentElement };
};

export { updateNameOfVariable };
