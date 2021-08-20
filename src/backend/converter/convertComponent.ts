import { Component, Model } from "../../types/ILibcellml";
import { Elements } from "../../types/Elements";
import { IProperties } from "../../types/IProperties";

// Convert Component into property-ready format
const convertComponent = (component: Component) => {
  console.log(component);
  if (component === null) {
    console.log("ConvertComponent: Given component is null");
  }
  // Obtain Reset details
  const resetNum = component.resetCount();
  const listReset = [];
  for (let i = 0; i < resetNum; i += 1) {
    listReset.push(component.reset(i).variable().name());
  }
  // Obtain Variable details
  const varNum = component.variableCount();
  const listVar = [];
  for (let i = 0; i < varNum; i += 1) {
    listVar.push(component.variableByIndex(i).name());
  }
  // Obtain Component details
  const compNum = component.componentCount();
  const listComponent = [];
  for (let i = 0; i < compNum; i += 1) {
    listComponent.push(component.componentByIndex(i).name());
  }
  // Formatting information
  const propertyFormat: IProperties = {
    type: Elements.component,
    attribute: {
      name: component.name(),
      math: component.math(),
    },
    children: {
      reset: listReset.map((name: string, index: number) => {
        return { name, index };
      }),
      variable: listVar.map((name: string, index: number) => {
        return { name, index };
      }),
      component: listComponent.map((name: string, index: number) => {
        return { name, index };
      }),
    },
    unit: [],
  };
  return propertyFormat;
};

export { convertComponent };
