import FileManagement from "../FileManagement";
import { Elements } from "../../types/Elements";
import { Units } from "../../types/ILibcellml";
import { IDirectSelect } from "../../types/IQuery";

const moveToUnits = (
  { select: { index, name }, parent }: IDirectSelect,
  fm: FileManagement
) => {
  const m = fm.parseModel(fm.getContent());
  console.log(parent);
  console.log(index);
  let parentElement = m;
  let currentElement: Units;
  if (name) {
    currentElement = parentElement.unitsByName(name);
  } else {
    currentElement = parentElement.unitsByIndex(index);
  }
  fm.setCurrent(currentElement, Elements.units);
};

export { moveToUnits };
