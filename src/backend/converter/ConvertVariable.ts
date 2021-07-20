import { Component } from "../../types/ILibcellml";
import { Elements } from "../../types/Elements";
import { Variable } from "../../types/ILibcellml";
import { IProperties } from "../../types/IProperties";

interface IEquivalentVar {
  name: string;
  parentName: string;
}

// Convert Variable into property-ready format
const convertVariable = (variable: Variable) => {
  // Obtain equivalent variable details
  // Equivalent to variables with Connections
  const eqVarCount: number = variable.equivalentVariableCount();
  const eqVarNameList: IEquivalentVar[] = [];
  for (let i = 0; i < eqVarCount; i += 1) {
    const v: Variable = variable.equivalentVariable(i);
    const parentName = (v.parent() as Component).name();
    eqVarNameList.push({ name: v.name(), parentName });
  }
  // Formatting information
  const varProp: IProperties = {
    type: Elements.variable,
    attribute: {
      name: variable.name(),
      interfaceType: variable.interfaceType(),
      initialValue: variable.initialValue(),
      units: variable.units().name(),
    },
    children: {
      connection: eqVarNameList.map(
        ({ name, parentName }: IEquivalentVar, index: number) => {
          return { name, parentName, index };
        }
      ),
    },
    unit: [],
  };
  return varProp;
};

export { convertVariable };
