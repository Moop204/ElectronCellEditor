interface IProperties {
  attribute: any;
  children: any;
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

interface IComponentProperties {
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
