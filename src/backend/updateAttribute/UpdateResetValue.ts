import { Component, Model, Reset } from "../../types/ILibcellml";

// Changes the reset_value attribute of a Reset element
// @model - The complete cellml file as a model
// @element - The type of element where math is being updated on
// @parentSelect - Identifying the parental element of the current element
// @value - Value that the math attribute will be replace with
// @currentElement - The currently selected Units
const updateResetValue = (model: Model, curElm: Reset, value: string) => {
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
        resetIndex = i;
        break;
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
