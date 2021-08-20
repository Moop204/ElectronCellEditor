import { Elements } from "./Elements";
import { IProperties } from "./IProperties";

// Types used for identifying elements

// Identifies an element relative to another
interface ISelect {
  element: Elements;
  select: ISearch;
}

interface IDirectSelect extends ISelect {
  parent: string;
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

export { IUpdate, ISelect, ISearch, ISelection, IDirectSelect };
