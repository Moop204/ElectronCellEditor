import { Elements, elmToStr } from "../../types/Elements";
import { ISelect } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { removeComponent } from "./removeComponent";
import { removeUnits } from "./removeUnits";
import { removeVariable } from "./removeVariable";
import { removeReset } from "./removeReset";
import { removeUnit } from "./removeUnit";
import { removeConnection } from "./removeConnection";

const removeElement = async (
  fm: FileManagement,
  { element, select }: ISelect
) => {
  switch (element) {
    case Elements.component:
      await removeComponent(fm, select);
      break;
    case Elements.units:
      await removeUnits(fm, select);
      break;
    case Elements.variable:
      await removeVariable(fm, select);
      break;
    case Elements.reset:
      await removeReset(fm, select);
      break;
    case Elements.unit:
      await removeUnit(fm, select);
      break;
    case Elements.connection:
      await removeConnection(fm, select);
      break;
    default:
      console.log("FM: Remove child - should not reach here");
      console.log(elmToStr(element));
    // }
  }
};

export { removeElement };
