import { UnitDescriptor } from "./UnitDescriptor";

interface IUnitWidget {
  unitMap: {
    description: UnitDescriptor;
    index: number;
  }[];
  parentName: string;
}

export { IUnitWidget };
