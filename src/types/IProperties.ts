import { Elements } from './Elements';

interface IProperties {
  type: Elements;
  attribute: Record<string, any>;
  children: Record<string, IChild[]>;
  parent: {
    name: string;
    type: Elements;
  };
}

interface IChild {
  name: string;
  index: number;
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
