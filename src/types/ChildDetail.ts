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

export { ChildDetail, ChildComponentDetail };
