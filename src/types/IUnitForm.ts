import { UnitDescriptor } from "./UnitDescriptor";

interface IUnitForm {
  parentName: string;
  units: {
    description: UnitDescriptor;
    index: number;
  }[];
}

export { IUnitForm };
