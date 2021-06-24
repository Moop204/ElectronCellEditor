import { Component } from "../../types/ILibcellml";
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

export { getAllVariableNames };
