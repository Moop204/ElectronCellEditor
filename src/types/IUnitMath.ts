import { UnitDescriptor } from "./UnitDescriptor";

interface IUnitMath {
  description: UnitDescriptor;
  parentName: string;
  index: number;
  onClick: () => void;
}

export { IUnitMath };
