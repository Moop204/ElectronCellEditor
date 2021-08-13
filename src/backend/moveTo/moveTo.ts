import FileManagement from "../FileManagement";
import { Elements, elmToStr } from "../../types/Elements";
import { moveToComponent } from "./moveToComponent";
import { IMoveTo } from "./interfaces";

const moveTo = (move: IMoveTo, fm: FileManagement) => {
  console.log("MOVE TO ");
  console.log(elmToStr(move.element));
  switch (move.element) {
    case Elements.model:
      fm.resetToModel();
      break;
    case Elements.component:
      moveToComponent(move, fm);
      break;

    default:
      console.log("MoveTo does not recognise the Element" + move.element);
  }
};

export { moveTo };
