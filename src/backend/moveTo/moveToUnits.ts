import FileManagement from "../FileManagement";
import { Elements } from "../../types/Elements";
import { IMoveTo } from "./interfaces";
import { Component, ComponentEntity, Units } from "../../types/ILibcellml";

const moveToUnits = (
  { search: { index, name }, parent }: IMoveTo,
  fm: FileManagement
) => {
  const m = fm._parser.parseModel(fm.getContent());
  console.log(parent);
  console.log(index);
  let parentElement = m;
  let currentElement: Units;
  if (name) {
    currentElement = parentElement.unitsByName(name);
  } else {
    currentElement = parentElement.unitsByIndex(index);
  }
  fm.setCurrentComponent(currentElement, Elements.units);
};

export { moveToUnits };