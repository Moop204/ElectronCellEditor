import FileManagement from "../FileManagement";
import { Elements } from "../../types/Elements";
import { IMoveTo } from "./interfaces";
import { Component, ComponentEntity, Variable } from "../../types/ILibcellml";

const moveToReset = (
  { search: { index, name }, parent }: IMoveTo,
  fm: FileManagement
) => {
  const m = fm.parseModel(fm.getContent());
  console.log(parent);
  console.log(index);
  const parentElement = m.componentByName(parent, true);
  let currentElement = parentElement.reset(index);
  fm.setCurrentComponent(currentElement, Elements.reset);
};

export { moveToReset };
