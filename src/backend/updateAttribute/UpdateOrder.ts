import { EditorElement } from "../../types/EditorElement";
import { Elements } from "../../types/Elements";
import { Component, Model, Reset } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";

const updateOrder = (
  model: Model,
  curElm: Reset,
  value: string,
  search: ISearch
) => {
  console.log("UPDATING ATTRIBUTE: Updating Order");
  if (curElm) {
    (curElm as Reset).setOrder(parseInt(value));
    console.log(curElm);
    const parentName = (curElm.parent() as Component).name();
    model
      .componentByName(parentName, true)
      .reset(search.index)
      .setOrder(parseInt(value));
    return {
      newModel: model,
      newCurrentElement: curElm as Reset,
    };
  }
  return {
    newModel: model,
    newCurrentElement: model,
  };
};

export { updateOrder };
