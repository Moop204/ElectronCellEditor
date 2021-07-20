import { Elements } from "../../types/Elements";
import { Model } from "../../types/ILibcellml";
import { IProperties } from "../../types/IProperties";

// Convert Model into property-ready format
const convertModel = (model: Model) => {
  if (model === null) {
    console.log("ConvertModel: Given model is null");
  }
  // Obtain Units details
  const unitsNum = model.unitsCount();
  const listUnitsName = [];
  for (let i = 0; i < unitsNum; i += 1) {
    listUnitsName.push(model.unitsByIndex(i).name());
  }
  // Obtain Component details
  const componentNum = model.componentCount();
  const listComponentName = [];
  for (let i = 0; i < componentNum; i += 1) {
    listComponentName.push(model.componentByIndex(i).name());
  }
  // Formatting information
  const propertyFormat: IProperties = {
    type: Elements.model,
    attribute: {
      name: model.name(),
    },
    children: {
      component: listComponentName.map((name: string, index: number) => {
        return { name, index };
      }),
      units: listUnitsName.map((name: string, index: number) => {
        return { name, index };
      }),
    },
    unit: [],
  };
  return propertyFormat;
};

export { convertModel };
