import { ISearch } from "../../types/IQuery";
import { Elements } from "../../types/Elements";

interface IMoveTo {
  element: Elements;
  search: ISearch;
  parent: string;
}

export { IMoveTo };
