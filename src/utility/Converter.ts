import { Elements } from '../types/Elements';
import {
  Model,
  Units,
  Component,
  NamedEntity,
  ComponentEntity,
  Variable,
  Reset,
} from '../types/ILibcellml';
import { IProperties } from '../types/IProperties';

const convertModel = (model: Model) => {
  const unitsNum = model.unitsCount();
  const componentNum = model.componentCount();

  const listUnitsName = [];
  const listComponentName = [];

  for (let i = 0; i < unitsNum; i += 1) {
    listUnitsName.push(model.unitsByIndex(i).name());
  }
  for (let i = 0; i < componentNum; i += 1) {
    listComponentName.push(model.componentByIndex(i).name());
  }
  const propertyFormat: IProperties = {
    type: Elements.model,
    attribute: {
      name: model.name(),
    },
    parent: {
      name: '',
      type: Elements.none,
    },
    children: {
      component: listComponentName.map((name: string, index: number) => {
        return { name, index };
      }),
      units: listUnitsName.map((name: string, index: number) => {
        return { name, index };
      }),
    },
  };
  return propertyFormat;
};

const convertComponent = (component: Component) => {
  const resetNum = component.resetCount();
  const varNum = component.variableCount();
  const compNum = component.componentCount();

  const listReset = [];
  for (let i = 0; i < resetNum; i += 1) {
    listReset.push(component.resetByIndex(i).variable().name());
  }

  const listVar = [];
  for (let i = 0; i < varNum; i += 1) {
    listVar.push(component.variableByIndex(i).name());
  }

  const listComponent = [];
  for (let i = 0; i < compNum; i += 1) {
    listComponent.push(component.componentByIndex(i).name());
  }

  const hasParent: boolean = component.hasParent();

  const propertyFormat: IProperties = {
    type: Elements.component,
    attribute: {
      name: component.name(),
      math: component.math(),
    },
    parent: {
      type: hasParent ? Elements.component : Elements.model,
      name: hasParent ? (component.parent() as Model | Component).name() : '',
    },
    children: {
      reset: listReset.map((name: string, index: number) => {
        return { name, index };
      }),
      variable: listVar.map((name: string, index: number) => {
        return { name, index };
      }),
      component: listComponent.map((name: string, index: number) => {
        return { name, index };
      }),
    },
  };
  return propertyFormat;
};

const convertUnits = (component: Units) => {
  const unitNum = component.unitCount();

  const listUnit = [];
  for (let i = 0; i < unitNum; i += 1) {
    const unitDescriptor = {
      reference: component.unitAttributeReferenceByIndex(i),
      prefix: component.unitAttributePrefixByIndex(i),
      exponent: component.unitAttributeExponentByIndex(i),
      multiplier: component.unitAttributeMultiplierByIndex(i),
      imported: component.isImport() ? component.importReference() : '',
    };
    listUnit.push(unitDescriptor);
  }

  const parentType: Elements = Elements.model;
  const parentElement = component.parent() as Model;

  // TODO: Unambiguous naming
  // Name refers to both name attribute, the name of the attribute of name and name of units
  const units: IProperties = {
    type: Elements.units,
    parent: {
      type: parentType,
      name: parentElement.name(),
    },
    attribute: {
      name: component.name(),
    },
    children: {
      unit: listUnit.map((name: any, index: number) => {
        return { name, index };
      }),
    },
  };

  return units;
};

const convertVariable = (variable: Variable) => {
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
      units: variable.units(),
    },
    children: {
      connection: eqVarNameList.map((name: string, index: number) => {
        return { name, index };
      }),
    },
  };

  return varProp;
};

const convertReset = (element: Reset) => {
  const resetProp: IProperties = {
    type: Elements.reset,
    parent: {
      type: Elements.component,
      name: (element.parent() as Component).name(),
    },
    attribute: {
      variable: element.variable(),
      testVariable: element.testVariable(),
      order: element.order(),
      resetValue: element.resetValue(),
      testValue: element.testValue(),
    },
    children: {},
  };
  return resetProp;
};

const convertSelectedElement = (
  selectedElement: Elements,
  curElm: Component | Model | Reset | Units | Variable | null
) => {
  let prop: IProperties = {
    type: Elements.none,
    attribute: {},
    children: {},
    parent: { name: '', type: Elements.none },
  };

  if (curElm) {
    switch (selectedElement) {
      case Elements.model:
        prop = convertModel(curElm as Model);
        break;
      case Elements.component:
        prop = convertComponent(curElm as Component);
        break;
      default:
    }
  }
  return prop;
};

export {
  convertModel,
  convertUnits,
  convertComponent,
  convertVariable,
  convertReset,
  convertSelectedElement,
};
