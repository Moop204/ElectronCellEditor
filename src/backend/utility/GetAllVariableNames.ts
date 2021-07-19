import { Component, Parser } from "../../types/ILibcellml";
import FileManagement from "../FileManagement";

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

interface VariableDescriptor {
  parent: string;
  variable: string;
}

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

const getGlobalVariableNames = async (fm: FileManagement) => {
  if (!fm._cellmlLoaded) {
    await fm.init();
  }
  const parser: Parser = new fm._cellml.Parser();
  const content = fm.getContent();
  const m = parser.parseModel(content);

  let res: VariableDescriptor[] = [];
  for (let i = 0; i < m.componentCount(); i++) {
    const c = m.componentByIndex(i);
    res = [...res, ...recursiveHelper(c)];
  }
  return res;
};

export { getAllVariableNames, getGlobalVariableNames, VariableDescriptor };
