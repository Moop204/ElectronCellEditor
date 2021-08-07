import { Component, Model, Reset } from "../../types/ILibcellml";

// Changes the test_value attribute of a Reset element
// @model - The complete cellml file as a model
// @element - The type of element where math is being updated on
// @parentSelect - Identifying the parental element of the current element
// @value - Value that the math attribute will be replace with
// @currentElement - The currently selected Reset
const updateTestValue = (
  model: Model,
  curElm: Reset,
  value: string,
  componentRoot: Component
) => {
  if (curElm) {
    // Updating current element
    (curElm as Reset).setTestValue(value);
    // Find Reset index
    console.log(curElm);
    const parent = curElm.parent() as Component;
    // const parent = componentRoot;
    const parentName = parent.name();
    let resetIndex = 0;
    for (let i = 0; i < parent.resetCount(); i++) {
      if (
        curElm.variable().name() === parent.reset(i).variable().name() &&
        curElm.order() === parent.reset(i).order()
      ) {
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
      .setTestValue(value);
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

export { updateTestValue };
