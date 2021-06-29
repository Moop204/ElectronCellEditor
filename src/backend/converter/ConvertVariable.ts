import { Component } from "../../types/ILibcellml";
import { Elements } from "../../types/Elements";
import { Variable } from "../../types/ILibcellml";
import { IProperties } from "../../types/IProperties";

const convertVariable = (variable: Variable) => {
  console.log(variable);
  const eqVarCount: number = variable.equivalentVariableCount();
  const eqVarNameList: string[] = [];
  for (let i = 0; i < eqVarCount; i += 1) {
    const v: Variable = variable.equivalentVariable(i);
    eqVarNameList.push(v.name());
  }

  const varProp: IProperties = {
    type: Elements.variable,
    parent: {
      type: Elements.component,
      name: (variable.parent() as Component).name(),
    },
    attribute: {
      name: variable.name(),
      interfaceType: variable.interfaceType(),
      initialValue: variable.initialValue(),
      units: variable.units().name(),
    },
    children: {
      connection: eqVarNameList.map((name: string, index: number) => {
        return { name, index };
      }),
    },
    unit: [],
  };

  return varProp;
};

export { convertVariable };
