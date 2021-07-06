import { ComponentEntity, Variable } from "../types/ILibcellml";

const findPublicVariables = (
  sharedParentElm: ComponentEntity,
  variable: Variable,
  exclude?: string
) => {
  const validVariables = [];
  const compNum = sharedParentElm.componentCount();
  for (let i = 0; i < compNum; i++) {
    const curComp = sharedParentElm.componentByIndex(i);
    const varNum = curComp.variableCount();
    const parentName = curComp.name();
    if (parentName === exclude) continue;
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
  }
  return validVariables;
};

export { findPublicVariables };
