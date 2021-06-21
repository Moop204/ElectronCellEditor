import { UnitDescriptor } from "../../types/UnitDescriptor";
import { Elements } from "../../types/Elements";
import { Units, Model } from "../../types/ILibcellml";
import { IProperties } from "../../types/IProperties";

const convertUnits = (unitsElement: Units) => {
  const unitNum = unitsElement.unitCount();

  const listUnit = [];
  for (let i = 0; i < unitNum; i += 1) {
    const unitDescriptor: UnitDescriptor = {
      reference: unitsElement.unitAttributeReference(i),
      prefix: unitsElement.unitAttributePrefix(i),
      exponent: unitsElement.unitAttributeExponent(i),
      multiplier: unitsElement.unitAttributeMultiplier(i),
      // TODO: Renable after ImportedEntity issue is resolved
      imported: "", // unitsElement.isImport() ? unitsElement.importReference() : '',
    };
    listUnit.push(unitDescriptor);
  }

  // TODO: Re-enable once bindings for .parent() function from libcellml is fixed
  // const parentType: Elements = Elements.model;
  // const parentElement = component.parent() as Model;

  // TODO: Unambiguous namingunitsElement
  // Name refers to both name attribute, the name of the attribute of name and name of units
  const units: IProperties = {
    type: Elements.units,
    parent: {
      // TODO: Re-enable once bindings for .parent() function from libcellml is fixed
      type: Elements.model, //parentType,
      name: "", //parentElement.name(),
    },
    attribute: {
      name: unitsElement.name(),
    },
    children: {},
    unit: listUnit.map((description: UnitDescriptor, index: number) => {
      return { description, index };
    }),
  };

  return units;
};

export { convertUnits };
