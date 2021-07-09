import { Elements, elmToStr } from "../../types/Elements";
import { ChildDetail } from "../../types/ChildDetail";
import {
  Parser,
  Printer,
  Model,
  Units,
  Variable,
  InterfaceType,
  Component,
} from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { RemoveComponent } from "./removeComponent";

const RemoveElement = async (
  fm: FileManagement,
  type: Elements,
  child: ISearch
) => {
  if (!fm._cellmlLoaded) {
    await fm.init();
  }
  switch (type) {
    case Elements.component:
      await RemoveComponent(fm, child);
      break;
    case Elements.units:
    case Elements.variable:
    case Elements.reset:
    case Elements.unit:
    default:
      console.log("FM: Remove child - should not reach here");
      console.log(elmToStr(type));
    // }
  }
};

export { RemoveElement };
