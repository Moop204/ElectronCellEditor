import { Component, Parser } from "../../types/ILibcellml";
import FileManagement from "../../backend/FileManagement";
import { VariableDescriptor } from "./VariableDescriptor";

// Obtain variables of the selected component
const getAllVariableNames = async (fm: FileManagement) => {
  const current = fm.getCurrent() as Component;
  console.log("Current?");
  console.log(current);
  const varCount = current.variableCount();
  const res: string[] = [];
  for (let i = 0; i < varCount; i++) {
    res.push(current.variableByIndex(i).name());
  }
  return res;
};

// Finds variables recursively
const recursiveHelper = (c: Component): VariableDescriptor[] => {
  let res: VariableDescriptor[] = [];
  for (let i = 0; i < c.variableCount(); i++) {
    res.push({
      parent: c.name(),
      variable: c.variableByIndex(i).name(),
    });
  }
  for (let i = 0; i < c.componentCount(); i++) {
    res = [...res, ...recursiveHelper(c.componentByIndex(i))];
  }
  return res;
};

// Find all variables mentioned in model
const getGlobalVariableNames = (fm: FileManagement): VariableDescriptor[] => {
  const content = fm.getContent();
  const m = fm.parseModel(content);

  let res: VariableDescriptor[] = [];
  for (let i = 0; i < m.componentCount(); i++) {
    const c = m.componentByIndex(i);
    res = [...res, ...recursiveHelper(c)];
  }
  return res;
};

const getVariablesofComponent = (component: Component) => {
  const res = [];

  for (let i = 0; i < component.variableCount(); i++) {
    const v = component.variableByIndex(i);
    res.push(v.name());
  }
  return res;
};

export {
  getAllVariableNames,
  getGlobalVariableNames,
  VariableDescriptor,
  getVariablesofComponent,
};
