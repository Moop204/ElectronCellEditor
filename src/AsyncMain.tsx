import { Event } from 'electron/main';
import { dialog } from 'electron';
import { IEvent } from 'monaco-editor';
import {
  Component,
  NamedEntity,
  ComponentEntity,
  Entity,
  ImportSource,
  Model,
  Reset,
  Units,
  Variable,
  Version,
  Parser,
  Validator,
  Printer,
} from './types/ILibcellml';
import {
  IProperties,
  IChild,
  IModelProperties,
  IComponentProperties,
} from './types/IProperties';
import { Elements } from './types/Elements';
import { IUpdate, ISearch, ISelect, ISelection } from './types/IQuery';

const libcellModule = require('libcellml.js/libcellml.common');

const { ipcMain } = require('electron');

let currentComponent1:
  | Component
  | ImportSource
  | Model
  | Reset
  | Units
  | Variable;

interface ImportInterface {
  model: string;
  valid: boolean;
}

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
  return {
    type: Elements.model,
    attribute: {
      name: model.name(),
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

  return {
    type: Elements.component,
    attribute: {
      name: component.name(),
      math: component.math(),
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

  // TODO: Unambiguous naming
  // Name refers to both name attribute, the name of the attribute of name and name of units
  const units: IProperties = {
    type: Elements.units,
    attribute: {
      name: component.name(),
    },
    children: {
      unit: listUnit.map((name: any, index: number) => {
        return { name, index };
      }),
    },
  };
  console.log('Converted to Units');
  console.log(units);

  return units;
};

const mainAsync = async () => {
  // Traversal
  // TODO: Select global
};

export { mainAsync, convertModel, convertComponent, convertUnits };
