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
import { Elements } from './static-interface/Elements';
import { ISearch, ISelect, ISelection } from './types/IQuery';

const libcellModule = require('libcellml.js/libcellml.common');

const fs = require('fs');
const { ipcMain } = require('electron');

let currentComponent:
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

const importFile = (
  fileLoc: string,
  parser: Parser,
  validator: Validator,
  printer: Printer
) => {
  console.log(`LIBCELL: Importing file ${fileLoc}`);
  const file: string = fs.readFileSync(fileLoc, 'utf8');
  try {
    console.log(file);
    //    const loadfile: string = fs.readFileSync(tmpArg, 'utf8');
    const model = parser.parseModel(file);
    console.log(`LIBCELL: Parsed Model`);
    currentComponent = model;
    validator.validateModel(model);
    console.log(`LIBCELL: Validated Model`);

    const noError = validator.errorCount();
    const errors = [];
    for (let errorNum = 0; errorNum < noError; errorNum += 1) {
      const issue = validator.error(errorNum);
      errors.push({
        desc: issue.description(),
        cause: issue.referenceHeading(),
      });
    }

    const noWarning = validator.warningCount();
    const warnings = [];
    for (let warningNum = 0; warningNum < noWarning; warningNum += 1) {
      const warning = validator.warning(warningNum);
      warnings.push({
        desc: warning.description(),
        cause: warning.referenceHeading(),
      });
    }

    const noHint = validator.hintCount();
    const hints = [];
    for (let i = 0; i < noHint; i += 1) {
      const hint = validator.hint(i);
      hints.push({
        desc: hint.description(),
        cause: hint.referenceHeading(),
      });
    }

    return {
      model: file,
      errors,
      warnings,
      hints,
    };
  } catch (e) {
    return {
      model: file,
      errors: null,
      warnings: null,
      hints: null,
    };
  }
};

const convertModel = () => {
  const model = currentComponent as Model;
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

const convertComponent = () => {
  const component = currentComponent as Component;
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

const findElement = (select: ISearch) => {
  const curComp = currentComponent as ComponentEntity;
  if (curComp) {
    const { name, index } = select;
    if (name != null) {
      currentComponent = curComp.componentByName(name, false);
    } else if (index != null) {
      currentComponent = curComp.componentByIndex(index);
    }
  }
};

const mainAsync = async () => {
  // const libcellml = await libcellModule();
  // const parser = new libcellml.Parser();
  // const validator = new libcellml.Validator();
  // const printer = new libcellml.Printer();

  // Traversal
  ipcMain.on('get-element', (event: any, element: Elements) => {
    let prop: IProperties;
    console.log(`LIBCELL: Get Element  ${element}`);
    if (currentComponent != null) {
      switch (element) {
        case Elements.model:
          prop = convertModel();
          break;
        case Elements.component:
          prop = convertComponent();
          break;
        default:
          console.log('UwU no elements');
          prop = { attribute: null, children: null };
      }
    } else {
      prop = null;
    }
    event.reply('res-get-element', prop);
  });

  ipcMain.on('select-element', (event: any, arg: ISelect) => {
    const { element, select } = arg;
    let prop: IProperties;

    switch (element) {
      case Elements.component:
        findElement(select);
        prop = convertComponent();
        break;
      default:
        prop = { attribute: null, children: null };
        console.log('Not a valid element.');
    }
    const selection: ISelection = { element, prop };
    event.reply('res-select-element', selection);
  });

  // TODO: Select global

  // ipcMain.on('select-component', (event: Event, arg: { index: number }) => {
  //   const curComp = currentComponent as ComponentEntity;
  //   if (curComp) {
  //     const { index } = arg;
  //     if (index > curComp.componentCount())
  //       currentComponent = curComp.componentByIndex(index);
  //     else {
  //       console.log('INVALID INDEX!!!');
  //       // Send a message to the error box?
  //     }
  //   } else {
  //     console.log('Model not loaded');
  //   }
  // });

  // ipcMain.on('selected-units', (event: any) => {
  //   const units = currentComponent as Units;
  //   const unitsNum = units.unitCount();

  //   const listUnitName = [];

  //   for (let i = 0; i < unitsNum; i += 1) {
  //     listUnitName.push(i);
  //   }

  //   const unitsProp: IUnitsProperties = {
  //     name: units.name(),
  //     children: {
  //       unit: listUnitName.map((i: number) => {
  //         return {
  //           reference: units.unitAttributeReferenceByIndex(i),
  //           prefix: units.unitAttributePrefixByIndex(i),
  //           exponent: units.unitAttributeExponentByIndex(i),
  //           multiplier: units.unitAttributeMultiplierByIndex(i),
  //         };
  //       }),
  //     },
  //   };
  //   event.reply('reply-selected-units', unitsProp);
  // });

  // ipcMain.on('selected-id', (event: Event) => {
  //   const curComp = currentComponent as Entity;
  //   event.reply(curComp.id());
  // });

  // ipcMain.on('selected-parent', (event: any) => {
  //   const curComp = currentComponent as Entity;
  //   if (currentComponent.hasParent()) event.reply(curComp.parent());
  //   event.reply(null);
  // });

  // ipcMain.on('selected-components', (event: any) => {
  //   const curComp = currentComponent as ComponentEntity;
  //   const components = [];
  //   for (let i = 0; i < curComp.componentCount(); i += 1) {
  //     components.push(curComp.componentByIndex(i));
  //   }
  //   event.reply(components);
  // });

  // ipcMain.on('selected-model-units', (event: any) => {
  //   const curComp = currentComponent as Model;
  //   const units = [];
  //   for (let i = 0; i < curComp.unitsCount(); i += 1) {
  //     units.push(curComp.takeUnitsByIndex(i));
  //   }
  //   event.reply(units);
  // });

  // ipcMain.on('selected-variable-units', (event: any) => {
  //   const curComp = currentComponent as Variable;
  //   event.reply(curComp.units());
  // });

  // ipcMain.on('selected-variables', (event: any) => {
  //   const curComp = currentComponent as Component;
  //   const variables = [];
  //   for (let i = 0; i < curComp.variableCount(); i += 1) {
  //     variables.push(curComp.variableByIndex(i));
  //   }
  //   event.reply(variables);
  // });

  // ipcMain.on('selected-reset', (event: any) => {
  //   const curComp = currentComponent as Component;
  //   const resets = [];
  //   for (let i = 0; i < curComp.resetCount(); i += 1) {
  //     resets.push(curComp.resetByIndex(i));
  //   }
  //   event.reply(resets);
  // });

  // ipcMain.on('selected-math', (event: any) => {
  //   const curComp = currentComponent as Component;
  //   event.reply(curComp.math());
  // });

  // // Information on Reset Element
  // ipcMain.on('selected-reset', (event: any) => {
  //   const curComp = currentComponent as Reset;

  //   const order = { order: curComp.isOrderSet() ? curComp.order() : null };
  //   const variable = { variable: curComp.variable() };
  //   const testValue = { testValue: curComp.testValue() };
  //   const id = { id: curComp.id() };
  //   const parent = { parent: curComp.hasParent() ? curComp.parent() : null };

  //   event.reply({ order, variable, testValue, id, parent });
  // });

  // // Information on Variable
  // ipcMain.on('selected-variable', (event: any) => {
  //   const curComp = currentComponent as Variable;

  //   const units = { units: curComp.units() };
  //   const initialValue = { units: curComp.initialValue() };
  //   const interfaceType = { interfaceType: curComp.interfaceType() };
  //   const name = { name: curComp.name() };
  //   const id = { id: curComp.id() };
  //   const parent = { parent: curComp.hasParent() ? curComp.parent() : null };

  //   event.reply({ units, initialValue, interfaceType, name, id, parent });
  // });

  // ipcMain.on('find-component', (event: any, compName: string) => {
  //   console.log('FIND COMPONENT');
  //   const curComp = currentComponent as ComponentEntity;

  //   if (curComp.containsComponentByName(compName, false)) {
  //     currentComponent = curComp.componentByName(compName, false);
  //     event.reply('select-component', convertComponent());
  //     console.log('SENT COMPONENT');
  //   }
  // });
};

export { mainAsync, importFile };
