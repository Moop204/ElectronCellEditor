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
import { RemoveUnits } from "./removeUnits";
import { RemoveVariable } from "./removeVariable";
import { RemoveReset } from "./removeReset";
import { RemoveUnit } from "./RemoveUnit";

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
      await RemoveUnits(fm, child);
      break;
    case Elements.variable:
      await RemoveVariable(fm, child);
      break;
    case Elements.reset:
      await RemoveReset(fm, child);
    case Elements.unit:
      await RemoveUnit(fm, child);
    default:
      console.log("FM: Remove child - should not reach here");
      console.log(elmToStr(type));
    // }
  }
};

export { RemoveElement };
