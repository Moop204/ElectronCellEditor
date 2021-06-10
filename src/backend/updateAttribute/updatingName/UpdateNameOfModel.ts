import { Model } from '../../../types/ILibcellml';

const updateNameOfModel = (
  model: Model,
  currentComponent: Model,
  value: string
) => {
  model.setName(value);
  currentComponent.setName(value);

  const editedModel = model;
  const editedCurrentElement = currentComponent;
  return { editedModel, editedCurrentElement };
};

export { updateNameOfModel };
