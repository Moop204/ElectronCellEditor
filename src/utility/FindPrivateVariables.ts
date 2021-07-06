import { ComponentEntity, Variable } from "../types/ILibcellml";

interface IVarIdentifier {
  parent: string;
  variable: string;
}

const findPrivateVariables = (
  currentElm: ComponentEntity,
  variable: Variable
): IVarIdentifier[] => {
  const validVariables = [];
  const compNum = currentElm.componentCount();
  for (let i = 0; i < compNum; i++) {
    const curComp = currentElm.componentByIndex(i);
    const varNum = curComp.variableCount();
    const parentName = curComp.name();
    for (let j = 0; j < varNum; j++) {
      const curVar = curComp.variableByIndex(j);
      const interfaceType = curVar.interfaceType();
      switch (interfaceType) {
        case "public":
        case "public_and_private":
          if (variable.hasEquivalentVariable(curVar, true)) {
            const varName = curVar.name();
            validVariables.push({ parent: parentName, variable: varName });
          }
          break;
      }
    }
    const subPrivateVars = findPrivateVariables(curComp, variable);
    for (const subVar of subPrivateVars) {
      validVariables.push(subVar);
    }
  }
  return validVariables;
};

export { findPrivateVariables };
