import { EditorElement } from "../../../types/EditorElement";
import { Model, Component } from "../../../types/ILibcellml";
import { ISearch } from "../../../types/IQuery";

const updateNameOfComponent = (
  model: Model,
  select: ISearch,
  currentElement: EditorElement,
  value: string
) => {
  const modelCopy = model.clone();
  const componentElement = modelCopy.componentByName(
    select.name as string,
    true
  );
  if (componentElement === null) {
    console.log("FM Error: Component Element is null");
  }
  componentElement.setName(value);
  modelCopy.replaceComponentByName(
    select.name as string,
    componentElement,
    true
  );
  if (currentElement === null) {
    console.log("FM: CurrentComponent is null when setting name");
  } else {
    (currentElement as Component).setName(value);
  }
  const editedModel = modelCopy;
  const editedCurrentElement = currentElement;
  return { editedModel, editedCurrentElement };
};

export { updateNameOfComponent };
