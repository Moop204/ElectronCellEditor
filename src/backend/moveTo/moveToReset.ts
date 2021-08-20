import FileManagement from "../FileManagement";
import { Elements } from "../../types/Elements";
import { IDirectSelect } from "../../types/IQuery";

const moveToReset = (
  { select: { index, name }, parent }: IDirectSelect,
  fm: FileManagement
) => {
  const m = fm.parseModel(fm.getContent());
  const parentElement = m.componentByName(parent, true);
  let currentElement = parentElement.reset(index);
  fm.setCurrent(currentElement, Elements.reset);
};

export { moveToReset };
