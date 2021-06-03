import { Elements } from '../../types/Elements';
import { Model } from '../../types/ILibcellml';
import { IProperties } from '../../types/IProperties';

const convertModel = (model: Model) => {
  const unitsNum = model.unitsCount();
  const componentNum = model.componentCount();

  const listUnitsName = [];
  const listComponentName = [];

  for (let i = 0; i < unitsNum; i += 1) {
    listUnitsName.push(model.unitsByIndex(i).name());
  }
  for (let i = 0; i < componentNum; i += 1) {
    listComponentName.push(model.componentByIndex(i).name());
  }
  const propertyFormat: IProperties = {
    type: Elements.model,
    attribute: {
      name: model.name(),
    },
    parent: {
      name: '',
      type: Elements.none,
    },
    children: {
      component: listComponentName.map((name: string, index: number) => {
        return { name, index };
      }),
      units: listUnitsName.map((name: string, index: number) => {
        return { name, index };
      }),
    },
  };
  return propertyFormat;
};

export { convertModel };
