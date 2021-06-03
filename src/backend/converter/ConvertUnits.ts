import { Elements } from '../../types/Elements';
import { Units, Model } from '../../types/ILibcellml';
import { IProperties } from '../../types/IProperties';

const convertUnits = (component: Units) => {
  const unitNum = component.unitCount();

  const listUnit = [];
  for (let i = 0; i < unitNum; i += 1) {
    const unitDescriptor = {
      reference: component.unitAttributeReferenceByIndex(i),
      prefix: component.unitAttributePrefixByIndex(i),
      exponent: component.unitAttributeExponentByIndex(i),
      multiplier: component.unitAttributeMultiplierByIndex(i),
      imported: component.isImport() ? component.importReference() : '',
    };
    listUnit.push(unitDescriptor);
  }

  // TODO: Re-enable once bindings for .parent() function from libcellml is fixed
  // const parentType: Elements = Elements.model;
  // const parentElement = component.parent() as Model;

  // TODO: Unambiguous naming
  // Name refers to both name attribute, the name of the attribute of name and name of units
  const units: IProperties = {
    type: Elements.units,
    parent: {
      // TODO: Re-enable once bindings for .parent() function from libcellml is fixed
      type: Elements.model, //parentType,
      name: '', //parentElement.name(),
    },
    attribute: {
      name: component.name(),
    },
    children: {
      unit: listUnit.map((name: any, index: number) => {
        return { name, index };
      }),
    },
  };

  return units;
};

export { convertUnits };
