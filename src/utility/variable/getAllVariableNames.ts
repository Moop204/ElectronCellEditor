import { Component, Parser } from "../../types/ILibcellml";
import FileManagement from "../../backend/FileManagement";
import { VariableDescriptor } from "./VariableDescriptor";

// Obtain variables of the selected component
const getAllVariableNames = async (fm: FileManagement) => {
  if (!fm._cellmlLoaded) {
    await fm.init();
  }
  const current = fm.getCurrentComponent() as Component;
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
  const m = fm._parser.parseModel(content);

  let res: VariableDescriptor[] = [];
  for (let i = 0; i < m.componentCount(); i++) {
    const c = m.componentByIndex(i);
    res = [...res, ...recursiveHelper(c)];
  }
  return res;
};

export { getAllVariableNames, getGlobalVariableNames, VariableDescriptor };
