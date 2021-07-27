import { EditorElement } from "../../types/EditorElement";
import { Elements } from "../../types/Elements";
import { Component, Model, Reset } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";

// Generate new model and current Reset
const updateOrder = (
  model: Model,
  curElm: Reset,
  value: string,
  search: ISearch
) => {
  console.log("UPDATING ATTRIBUTE: Updating Order");
  console.log("Order " + value + typeof value);
  if (curElm) {
    (curElm as Reset).setOrder(parseInt(value));
    console.log(curElm);
    const parent = curElm.parent() as Component;
    const parentName = parent.name();
    // Find Reset index
    let resetIndex = 0;
    for (let i = 0; i < parent.resetCount(); i++) {
      if (
        curElm.variable().name() === parent.reset(i).variable().name() &&
        curElm.order() === parent.reset(i).order()
      ) {
        console.log("I FOUND A GOOD ONE " + i);
        resetIndex = i;
        break;
      } else {
        console.log(curElm.order() + " " + parent.reset(i).order());
      }
    }
    model
      .componentByName(parentName, true)

      .reset(resetIndex)
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
