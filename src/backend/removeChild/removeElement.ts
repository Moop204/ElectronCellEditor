import { Elements, elmToStr } from "../../types/Elements";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { removeComponent } from "./removeComponent";
import { removeUnits } from "./removeUnits";
import { removeVariable } from "./removeVariable";
import { removeReset } from "./removeReset";
import { removeUnit } from "./removeUnit";
import { removeConnection } from "./removeConnection";

const removeElement = async (
  fm: FileManagement,
  type: Elements,
  child: ISearch
) => {
  if (!fm._cellmlLoaded) {
    await fm.init();
  }
  switch (type) {
    case Elements.component:
      await removeComponent(fm, child);
      break;
    case Elements.units:
      await removeUnits(fm, child);
      break;
    case Elements.variable:
      await removeVariable(fm, child);
      break;
    case Elements.reset:
      await removeReset(fm, child);
      break;
    case Elements.unit:
      await removeUnit(fm, child);
      break;
    case Elements.connection:
      await removeConnection(fm, child);
      break;
    default:
      console.log("FM: Remove child - should not reach here");
      console.log(elmToStr(type));
    // }
  }
};

export { removeElement };
