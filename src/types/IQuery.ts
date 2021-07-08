import { Elements } from "./Elements";
import { IProperties } from "./IProperties";

interface ISelect {
  element: Elements;
  select: ISearch;
}

interface IUpdate {
  element: Elements; // Element of the item being updated, maybe redundant
  select: ISearch;
  attribute: string;
  value: any;
}

interface ISearch {
  index: number | null;
  name: string | null;
}

interface ISelection {
  element: Elements;
  prop: IProperties;
}

export { IUpdate, ISelect, ISearch, ISelection };
