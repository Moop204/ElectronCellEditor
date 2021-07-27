import { Elements } from "./Elements";

interface ChildDetail {
  type: Elements;
  attribute: any;
}

interface ChildComponentDetail extends ChildDetail {
  attribute: {
    name: string;
    imported: boolean;
    source: string | null;
    component_ref: string | null;
  };
}

interface ChildResetDetail extends ChildDetail {
  attribute: {
    reset_variable: string;
    test_variable: string;
    order: number;
    reset_value: string;
    test_value: string;
  };
}

interface ChildUnitDetail extends ChildDetail {
  attribute: {
    prefix: string;
    multiplier: string;
    exponent: string;
    units: string;
  };
}

interface ChildUnitsDetail extends ChildDetail {
  attribute: {
    name: string;
    imported: boolean;
    source: string;
    component_ref: string;
  };
}

interface ChildVariableDetail extends ChildDetail {
  attribute: {
    name: string;
    varInterface: string;
    initialValue: string;
    units: string;
  };
}

export {
  ChildDetail,
  ChildComponentDetail,
  ChildResetDetail,
  ChildUnitDetail,
  ChildUnitsDetail,
  ChildVariableDetail,
};
