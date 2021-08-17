import FileManagement from "../FileManagement";
import { Elements } from "../../types/Elements";
import { IMoveTo } from "./interfaces";
import { Component, ComponentEntity, Variable } from "../../types/ILibcellml";

const moveToVariable = (
  { search: { index, name }, parent }: IMoveTo,
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
  fm.setCurrentComponent(currentElement, Elements.variable);
};

export { moveToVariable };
