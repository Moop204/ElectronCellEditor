import { Elements, elmToStr } from "../../types/Elements";
import { ChildDetail } from "../../types/ChildDetail";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { addComponent } from "./addComponent";
import { addReset } from "./addReset";
import { addUnit } from "./addUnit";
import { addUnits } from "./addUnits";
import { addVariable } from "./addVariable";
import { addConnection } from "./addConnection";

const addChild = async (
  fm: FileManagement,
  child: ChildDetail,
  parentType: Elements
) => {
  console.log("Adding child " + elmToStr(child.type));
  switch (child.type) {
    case Elements.component: {
      await addComponent(fm, parentType, child);
      break;
    }
    case Elements.units: {
      await addUnits(fm, child);
      break;
    }
    case Elements.variable: {
      await addVariable(fm, child);
      break;
    }
    case Elements.reset: {
      await addReset(fm, child);
      break;
    }
    case Elements.unit: {
      await addUnit(fm, child);
      break;
    }
    case Elements.connection: {
      await addConnection(fm, child);
      break;
    }
    default:
      console.log("FM: Add child - should not reach here");
    // }
  }
};

export { addChild };
