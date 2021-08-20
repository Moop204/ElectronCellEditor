import FileManagement from "../FileManagement";
import { Elements } from "../../types/Elements";
import { Component, ComponentEntity } from "../../types/ILibcellml";
import { IDirectSelect } from "../../types/IQuery";

const moveToComponent = (
  { select: { index, name }, parent }: IDirectSelect,
  fm: FileManagement
) => {
  const m = fm.parseModel(fm.getContent());
  console.log(parent);
  console.log(index);
  let parentElement: ComponentEntity;
  if (parent === m.name()) {
    parentElement = m;
  } else {
    parentElement = m.componentByName(parent, true);
  }
  let currentElement: Component;
  if (name) {
    currentElement = parentElement.componentByName(name, true);
  } else {
    currentElement = parentElement.componentByIndex(index);
  }
  fm.setCurrent(currentElement, Elements.component);
};

export { moveToComponent };
