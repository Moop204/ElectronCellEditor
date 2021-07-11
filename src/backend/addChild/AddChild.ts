import { Elements } from "../../types/Elements";
import { ChildDetail } from "../../types/ChildDetail";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { AddComponent } from "./AddComponent";
import { AddReset } from "./AddReset";
import { AddUnit } from "./AddUnit";
import { AddUnits } from "./AddUnits";
import { AddChildVariable } from "./AddChildVariable";

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
      await AddChildVariable(fm, parent, child);
      break;
    }
    case Elements.reset: {
      await AddReset(fm, child);
      break;
    }
    case Elements.unit: {
      await AddUnit(fm, child);
      break;
    }
    default:
      console.log("FM: Add child - should not reach here");
    // }
  }
};

export { AddChild };
