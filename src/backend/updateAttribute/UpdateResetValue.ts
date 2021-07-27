import { EditorElement } from "../../types/EditorElement";
import { Elements } from "../../types/Elements";
import { Component, Model, Reset } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";

// Change the reset value for Reset
const updateResetValue = (model: Model, curElm: Reset, value: string) => {
  console.log("UPDATING ATTRIBUTE: Updating Reset Value");
  console.log(value);

  if (curElm) {
    // Updating current element
    (curElm as Reset).setResetValue(value);
    // Find Reset index
    const parent = curElm.parent() as Component;
    const parentName = parent.name();
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
    // Updating model
    model
      .componentByName(parentName, true)
      .reset(resetIndex)
      .setResetValue(value);
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

export { updateResetValue };
