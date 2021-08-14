import FileManagement from "../FileManagement";
import { Elements, elmToStr } from "../../types/Elements";
import { moveToComponent } from "./moveToComponent";
import { IMoveTo } from "./interfaces";
import { moveToModel } from "./moveToModel";
import { moveToVariable } from "./moveToVariable";
import { moveToUnits } from "./moveToUnits";
import { moveToReset } from "./moveToReset";

const moveTo = (move: IMoveTo, fm: FileManagement) => {
  console.log("MOVE TO ");
  console.log(elmToStr(move.element));
  switch (move.element) {
    case Elements.model:
      moveToModel(fm);
      break;
    case Elements.component:
      moveToComponent(move, fm);
      break;
    case Elements.variable:
      moveToVariable(move, fm);
      break;
    case Elements.units:
      moveToUnits(move, fm);
      break;
    case Elements.reset:
      moveToReset(move, fm);
      break;
    default:
      console.log(
        "MoveTo does not recognise the Element" + elmToStr(move.element)
      );
  }
};

export { moveTo };
