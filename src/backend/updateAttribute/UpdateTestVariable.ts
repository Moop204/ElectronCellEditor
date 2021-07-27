import { EditorElement } from "../../types/EditorElement";
import { Elements } from "../../types/Elements";
import { Component, Model, Reset } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";

// Change the test variable referenced for Reset
// @model - Model that will be changed
// @curElm - Currently selected reset
// @value - Name of the variable. Variable must exist within the current Element.
const updateTestVariable = (model: Model, curElm: Reset, value: string) => {
  console.log("UPDATING ATTRIBUTE: Updating Test Variable");
  console.log(value);

  const variable = value;
  // Find variable
  const parent = curElm.parent() as Component;
  const parentName = parent.name();
  const newVar = model
    .componentByName(parentName, true)
    .variableByName(variable);

  if (curElm) {
    (curElm as Reset).setTestVariable(newVar);
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
      .setTestVariable(newVar);
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

export { updateTestVariable };
