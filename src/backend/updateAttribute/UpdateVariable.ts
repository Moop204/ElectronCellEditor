import { EditorElement } from "../../types/EditorElement";
import { Elements } from "../../types/Elements";
import { Component, Model, Reset } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";

// Change the variable referenced for Reset
const updateVariable = (model: Model, curElm: Reset, value: string) => {
  console.log("UPDATING ATTRIBUTE: Updating Order");
  console.log("Order " + value + typeof value);
  const variable = value;
  // Find variable
  console.log(curElm);
  const parent = curElm.parent() as Component;
  const parentName = parent.name();
  const newVar = model
    .componentByName(parentName, true)
    .variableByName(variable);

  if (curElm) {
    (curElm as Reset).setVariable(newVar);
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
      .setVariable(newVar);
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

export { updateVariable };
