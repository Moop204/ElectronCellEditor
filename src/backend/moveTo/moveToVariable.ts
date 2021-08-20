import FileManagement from "../FileManagement";
import { Elements } from "../../types/Elements";
import { Variable } from "../../types/ILibcellml";
import { IDirectSelect } from "../../types/IQuery";

const moveToVariable = (
  { select: { index, name }, parent }: IDirectSelect,
  fm: FileManagement
) => {
  const m = fm.parseModel(fm.getContent());
  console.log(parent);
  console.log(index);
  const parentElement = m.componentByName(parent, true);
  let currentElement: Variable;
  if (name) {
    currentElement = parentElement.variableByName(name);
  } else {
    currentElement = parentElement.variableByIndex(index);
  }
  fm.setCurrent(currentElement, Elements.variable);
};

export { moveToVariable };
