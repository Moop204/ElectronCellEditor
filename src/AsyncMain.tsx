import { Event } from 'electron/main';
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
import { IModelProperties } from './types/IModelProperties';
import { IUnitsProperties } from './types/IUnitsProperties';
import libcellModule from './wasm/libcellml';
import { dialog } from 'electron';

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
  const file: string = fs.readFileSync(fileLoc, 'utf8');
  //    const loadfile: string = fs.readFileSync(tmpArg, 'utf8');
  const model = parser.parseModel(file);
  currentComponent = model;
  validator.validateModel(model);

  const noError = validator.errorCount();
  let errors = [];
  for (let errorNum = 0; errorNum < noError; errorNum++) {
    const issue = validator.error(errorNum);
    errors.push({
      desc: issue.description(),
      cause: issue.referenceHeading(),
    });
  }

  const noWarning = validator.warningCount();
  let warnings = [];
  for (let warningNum = 0; warningNum < noWarning; warningNum++) {
    const warning = validator.warning(warningNum);
    warnings.push({
      desc: warning.description(),
      cause: warning.referenceHeading(),
    });
  }

  const noHint = validator.hintCount();
  let hints = [];
  for (let i = 0; i < noHint; i++) {
    const hint = validator.hint(i);
    hints.push({
      desc: hint.description(),
      cause: hint.referenceHeading(),
    });
  }

  return {
    model: validator.issueCount() > 0 ? file : printer.printModel(model),
    errors: errors,
    warnings: warnings,
    hints: hints,
  };
};

const mainAsync = async () => {
  // const libcellml = await libcellModule();
  // const parser = new libcellml.Parser();
  // const validator = new libcellml.Validator();
  // const printer = new libcellml.Printer();

  // Traversal
  ipcMain.on('select-component', (event: Event, arg: { index: number }) => {
    const curComp = currentComponent as ComponentEntity;
    if (curComp) {
      const { index } = arg;
      if (index > curComp.componentCount())
        currentComponent = curComp.componentByIndex(index);
      else {
        console.log('INVALID INDEX!!!');
        // Send a message to the error box?
      }
    } else {
      console.log('Model not loaded');
    }
  });

  // Get details about currently selected element
  ipcMain.on('selected-name', (event: Event) => {
    const curComp = currentComponent as NamedEntity;
    if (curComp) {
      console.log('ME NAMES ' + curComp.name());
      event.reply('reply-selected-name', [
        {
          key: 'Name',
          value: curComp.name(),
        },
      ]);
    } else {
      console.log('NO NAMES AHHHHHHHHHH');
      event.reply('reply-selected-name', 'No element selected.');
    }
  });

  ipcMain.on('selected-model', (event: Event) => {
    const model = currentComponent as Model;
    const unitsNum = model.unitsCount();    
    const componentNum = model.componentCount();    

    let listUnitsName = []; 
    let listComponentName = [];

    for(let i=0;i<unitsNum;i++) {
      listUnitsName.push(model.unitsByIndex(i).name());
    }
    for(let i=0;i<componentNum;i++) {
      listComponentName.push(model.componentByIndex(i).name());
    }
    const modelProp: IModelProperties = {
      name: model.name(), 
      children: {
        components: listComponentName.map((name: string, index: number) => {
          return {name, index};  
        }),
        units: listUnitsName.map((name: string, index: number) => {
          return {name, index};  
        }),
      }
    };
    event.reply('reply-selected-model', modelProp);
  });

  ipcMain.on('selected-units', (event: Event) => { 
    const units = currentComponent as Units;
    const unitsNum = units.unitCount();    

    let listUnitName = []; 

    for(let i=0;i<unitsNum;i++) {
      listUnitName.push(i);
    }
    // std::string	unitAttributeReferenceByIndex(size_t index)
    // std::string	unitAttributePrefixByIndex(size_t index)
    // double	unitAttributeExponentByIndex(size_t index)
    // double	unitAttributeMultiplierByIndex(size_t index) 

    const unitsProp: IUnitsProperties = {
      name: units.name(), 
      children: {
        unit: listUnitName.map((i: number) => {
          return { 
            reference: units.unitAttributeReferenceByIndex(i), 
            prefix: units.unitAttributePrefixByIndex(i),
            exponent: units.unitAttributeExponentByIndex(i), 
            multiplier: units.unitAttributeMultiplierByIndex(i)
          }
        })
      },      
    };
    event.reply('reply-selected-units', unitsProp);
  })

  ipcMain.on('selected-id', (event: Event) => {
    const curComp = currentComponent as Entity;
    event.reply(curComp.id());
  });

  ipcMain.on('selected-parent', (event: Event) => {
    const curComp = currentComponent as Entity;
    if (currentComponent.hasParent()) event.reply(curComp.parent());
    event.reply(null);
  });

  ipcMain.on('selected-components', (event: Event) => {
    const curComp = currentComponent as ComponentEntity;
    let components = [];
    for (let i = 0; i < curComp.componentCount(); i++) {
      components.push(curComp.componentByIndex(i));
    }
    event.reply(components);
  });

  ipcMain.on('selected-model-units', (event: Event) => {
    const curComp = currentComponent as Model;
    let units = [];
    for (let i = 0; i < curComp.unitsCount(); i++) {
      units.push(curComp.takeUnitsByIndex(i));
    }
    event.reply(units);
  });

  ipcMain.on('selected-variable-units', (event: Event) => {
    const curComp = currentComponent as Variable;
    event.reply(curComp.units());
  });

  ipcMain.on('selected-variables', (event: Event) => {
    const curComp = currentComponent as Component;
    let variables = [];
    for (let i = 0; i < curComp.variableCount(); i++) {
      variables.push(curComp.variableByIndex(i));
    }
    event.reply(variables);
  });

  ipcMain.on('selected-reset', (event: Event) => {
    const curComp = currentComponent as Component;
    let resets = [];
    for (let i = 0; i < curComp.resetCount(); i++) {
      resets.push(curComp.resetByIndex(i));
    }
    event.reply(resets);
  });

  ipcMain.on('selected-math', (event: Event) => {
    const curComp = currentComponent as Component;
    event.reply(curComp.math());
  });

  // Information on Reset Element
  ipcMain.on('selected-reset', (event: Event) => {
    const curComp = currentComponent as Reset;

    const order = { order: curComp.isOrderSet() ? curComp.order() : null };
    const variable = { variable: curComp.variable() };
    const testValue = { testValue: curComp.testValue() };
    const id = { id: curComp.id() };
    const parent = { parent: curComp.hasParent() ? curComp.parent() : null };

    event.reply({ order, variable, testValue, id, parent });
  });

  // Information on Variable
  ipcMain.on('selected-variable', (event: Event) => {
    const curComp = currentComponent as Variable;

    const units = { units: curComp.units() };
    const initialValue = { units: curComp.initialValue() };
    const interfaceType = { interfaceType: curComp.interfaceType() };
    const name = { name: curComp.name() };
    const id = { id: curComp.id() };
    const parent = { parent: curComp.hasParent() ? curComp.parent() : null };

    event.reply({ units, initialValue, interfaceType, name, id, parent });
  });
};

export { mainAsync, importFile };
