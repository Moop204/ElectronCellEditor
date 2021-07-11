import { UnitDescriptor } from "./UnitDescriptor";
import { Elements } from "./Elements";

interface IProperties {
  type: Elements;
  attribute: Record<string, any>;
  children: Record<string, IChild[]>;
  unit: { description: UnitDescriptor; index: number }[];
}

interface IChild {
  name: string;
  index: number;
  parentName?: string;
}

interface IModelProperties extends IProperties {
  attribute: {
    name: string;
  };
  children: {
    units: IChild[];
    component: IChild[];
  };
}

interface IComponentProperties extends IProperties {
  attribute: {
    name: string;
    math: string;
  };
  children: {
    reset: IChild[];
    variable: IChild[];
  };
}

export { IProperties, IChild, IModelProperties, IComponentProperties };
