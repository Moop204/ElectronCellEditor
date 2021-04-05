import { Elements } from '../static-interface/Elements';
import { IProperties } from './IProperties';

interface ISelect {
  element: Elements;
  select: ISearch;
}

interface ISearch {
  index: number | null;
  name: string | null;
}

interface ISelection {
  element: Elements;
  prop: IProperties;
}

export { ISelect, ISearch, ISelection };
