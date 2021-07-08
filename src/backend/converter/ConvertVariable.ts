import { Component } from "../../types/ILibcellml";
import { Elements } from "../../types/Elements";
import { Variable } from "../../types/ILibcellml";
import { IProperties } from "../../types/IProperties";

interface IEquivalentVar {
  name: string;
  parentName: string;
}

const convertVariable = (variable: Variable) => {
  console.log(variable);
  const eqVarCount: number = variable.equivalentVariableCount();
  const eqVarNameList: IEquivalentVar[] = [];
  for (let i = 0; i < eqVarCount; i += 1) {
    const v: Variable = variable.equivalentVariable(i);
    const parentName = (v.parent() as Component).name();
    eqVarNameList.push({ name: v.name(), parentName });
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
