import { Component, Model, Reset } from "../../types/ILibcellml";

// Change the test variable referenced for Reset
// @model - Model that will be changed
// @curElm - Currently selected reset
// @value - Name of the variable. Variable must exist within the current Element.
const updateTestVariable = (
  model: Model,
  curElm: Reset,
  value: string,
  componentRoot: Component
) => {
  const variable = value;
  // Find variable
  const parent = curElm.parent() as Component;
  // const parent = componentRoot;
  const parentName = parent.name();
  const newVar = model
    .componentByName(parentName, true)
    .variableByName(variable);

  if (curElm) {
    (curElm as Reset).setTestVariable(newVar);
    console.log(curElm);
    // Find Reset index
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
