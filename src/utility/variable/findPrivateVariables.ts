import { ComponentEntity, Variable } from "../../types/ILibcellml";
import { VariableDescriptor } from "./VariableDescriptor";

// Identify private variables of the current element
// @currentElm  - Currently selected Component
// @variable    - Variable of the currently selected Component which
//                the resulting variables have a private relation with
const findPrivateVariables = (
  currentElm: ComponentEntity,
  variable: Variable
): VariableDescriptor[] => {
  const validVariables = [];
  const compNum = currentElm.componentCount();
  for (let i = 0; i < compNum; i++) {
    const curComp = currentElm.componentByIndex(i);
    const varNum = curComp.variableCount();
    const parentName = curComp.name();
    console.log(`Parent Name: ${parentName}`);
    for (let j = 0; j < varNum; j++) {
      const curVar = curComp.variableByIndex(j);
      const u1 = curVar.units();
      console.log(`Var Name: ${curVar.name()}`);
      const interfaceType = curVar.interfaceType();
      switch (interfaceType) {
        case "public":
        case "public_and_private":
          const u2 = variable.units();
          if (u1.compatible(u1, u2)) {
            const varName = curVar.name();
            validVariables.push({ parent: parentName, variable: varName });
            console.log("Y");
          } else {
            console.log("N");
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
