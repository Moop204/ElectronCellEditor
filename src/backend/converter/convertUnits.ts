import { UnitDescriptor } from "../../types/UnitDescriptor";
import { Elements } from "../../types/Elements";
import { Units } from "../../types/ILibcellml";
import { IProperties } from "../../types/IProperties";

// Convert Variable into property-ready format
const convertUnits = (unitsElement: Units) => {
  const unitNum = unitsElement.unitCount();

  // Obtains Unit details
  const listUnit = [];
  for (let i = 0; i < unitNum; i += 1) {
    const unitDescriptor: UnitDescriptor = {
      reference: unitsElement.unitAttributeReference(i),
      prefix: unitsElement.unitAttributePrefix(i),
      exponent: unitsElement.unitAttributeExponent(i),
      multiplier: unitsElement.unitAttributeMultiplier(i),
      // TODO: Renable after ImportedEntity issue is resolved for Units
      imported: "", // unitsElement.isImport() ? unitsElement.importReference() : '',
    };
    listUnit.push(unitDescriptor);
  }
  // Formatting information
  const units: IProperties = {
    type: Elements.units,
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
