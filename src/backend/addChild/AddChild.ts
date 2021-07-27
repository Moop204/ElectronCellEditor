import { Elements } from "../../types/Elements";
import { ChildDetail } from "../../types/ChildDetail";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { AddComponent } from "./AddComponent";
import { AddReset } from "./AddReset";
import { addUnit } from "./addUnit";
import { AddUnits } from "./AddUnits";
import { AddVariable } from "./AddVariable";

const AddChild = async (
  fm: FileManagement,
  child: ChildDetail,
  parent: ISearch,
  parentType: Elements
) => {
  if (!fm._cellmlLoaded) {
    await fm.init();
  }
  switch (child.type) {
    case Elements.component:
      await AddComponent(fm, parentType, child);
      break;
    case Elements.units:
      await AddUnits(fm, child);
      break;
    case Elements.variable: {
      await AddVariable(fm, child);
      break;
    }
    case Elements.reset: {
      await AddReset(fm, child);
      break;
    }
    case Elements.unit: {
      await addUnit(fm, child);
      break;
    }
    default:
      console.log("FM: Add child - should not reach here");
    // }
  }
};

export { AddChild };
