import { Model, Parser, Printer, Variable } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";
import { EditorElement } from "../../types/EditorElement";
import { generateModel } from "../addChild/generateModel";
import { Elements } from "../../types/Elements";

// Removes Connection from Model
// Assumption: Currently at a Variable
// @fm - State management of model
// @child - Identifies Connection to be removed by name
const removeConnection = async (fm: FileManagement, child: ISearch) => {
  const libcellml = fm._cellml;
  const m = generateModel(libcellml, fm.getContent());
  const currentVariable = fm.getCurrentComponent() as Variable;
  const parentName = (currentVariable.parent() as Variable).name();
  const firstVar = m
    .componentByName(parentName, true)
    .variableByName(currentVariable.name());
  const secondVar = firstVar.equivalentVariable(child.index);

  // Remove connection
  const commandVar: Variable = fm._cellml.Variable;
  const removed = commandVar.removeEquivalence(firstVar, secondVar);
  if (!removed) {
    console.log("Failed to remove Connection");
  }

  await fm.updateContentFromModel(m);
  // const compParent = m.componentByName(parentName, true);
  // const newVariable = compParent.variableByName(currentVariable.name());
  fm.setCurrentComponent(firstVar, Elements.variable);
};

export { removeConnection };
