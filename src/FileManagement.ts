/* eslint-disable no-case-declarations */
import { ipcMain } from 'electron';
import { BrowserWindow } from 'electron/main';
import _ from 'underscore';
import {
  convertComponent,
  convertModel,
  convertUnits,
} from './utility/Converter';
import { NewChild } from './static-interface/AddChildrenInterface';
import { Elements, elmToStr } from './types/Elements';
import {
  Component,
  ComponentEntity,
  Model,
  Reset,
  Units,
  Variable,
  Parser,
  Printer,
  Validator,
  Issue,
} from './types/ILibcellml';
import { IProperties } from './types/IProperties';
import { ISearch, ISelect, ISelection, IUpdate } from './types/IQuery';

const fs = require('fs');

const libcellModule = require('libcellml.js/libcellml.common');

// Command Pattern
// Handles the truth in the backend
export default class FileManagement {
  content: string;

  currentComponent: Component | Model | Reset | Units | Variable | null;

  type: Elements;

  constructor() {
    this.content = '';
    this.currentComponent = null;
    this.type = Elements.model;
  }

  updateContent(s: string) {
    this.content = s;
    // console.log('!!!CONTENT HAS BEEN UPDATED TO!!!');
    // console.log(s);
  }

  // Getters and Setters

  getContent() {
    return this.content;
  }

  setCurrentComponent(
    currentComponent: Component | Model | Reset | Units | Variable | null
  ) {
    this.currentComponent = currentComponent;
  }

  getCurrentComponent() {
    return this.currentComponent;
  }

  // Helpers

  // Find selected element
  findElement(select: ISearch, element: Elements) {
    if (!this.currentComponent) {
      return;
    }
    const { name, index } = select;

    switch (element) {
      case Elements.model:
      case Elements.component:
        const curComp = this.currentComponent as ComponentEntity;
        if (name != null) {
          this.currentComponent = curComp.componentByName(name, false);
        } else if (index != null) {
          this.currentComponent = curComp.componentByIndex(index);
        }
        break;
      case Elements.units:
        // Parent
        const curComp1 = this.currentComponent as Model;
        if (name != null) {
          if (curComp1.hasUnitsByName(name)) {
            this.currentComponent = curComp1.unitsByName(name);
          } else {
            this.currentComponent = curComp1.unitsByName(name.slice(1));
          }
        } else if (index != null) {
          this.currentComponent = curComp1.unitsByIndex(index);
        }
        break;
      default:
        break;
    }
  }

  // Import File
  importFile(fileLoc: string, parser: Parser, validator: Validator) {
    const file: string = fs.readFileSync(fileLoc, 'utf8');
    try {
      const model = parser.parseModel(file);
      this.updateContent(file);
      this.setCurrentComponent(model);
      validator.validateModel(model);

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
      this.type = Elements.model;
      return {
        model: file,
        errors,
        warnings,
        hints,
      };
    } catch (e) {
      console.log('LIBCELLML: Failed to load errors');
      return {
        model: file,
        errors: null,
        warnings: null,
        hints: null,
      };
    }
  }

  // Print out model

  printModel = async () => {
    const content = this.getContent();
    console.log('PRINTING OUT MODEL');
    console.log(content);

    const libcellml = await libcellModule();
    const parser = new libcellml.Parser();
    const model = parser.parseModel(content);
    console.log('Components');
    for (let i = 0; i < model.componentCount(); i++) {
      console.log(model.componentByIndex(i).name());
    }
  };

  // Definitely name attribute search
  updateName(
    model: Model,
    element: Elements,
    select: ISearch,
    parentSelect: ISearch,
    value: any,
    attribute: string
  ) {
    console.log(`FILEMANAGEMENT: Finding ${select.name}`);

    // Modify model
    // and current component parallel
    const modelCopy = model.clone();

    switch (element) {
      case Elements.component:
        console.log('COMPONENT');
        console.log(`Name is ${(this.currentComponent as Component).name()}`);
        console.log(`Looking for ${select.name}`);

        const componentElement = modelCopy.takeComponentByName(
          select.name as string,
          true
        );

        if (componentElement === null) {
          console.log('FM Error: Component Element is null');
        }
        componentElement.setName(value);
        model.replaceComponentByName(
          select.name as string,
          componentElement,
          true
        );
        if (this.currentComponent === null) {
          console.log('FM: CurrentComponent is null when setting name');
        } else {
          (this.currentComponent as Component).setName(value);
        }
        break;
      case Elements.model:
        model.setName(value);
        break;
      case Elements.variable:
        model
          .takeComponentByName(parentSelect.name as string, true)
          .takeVariableByName(select.name as string)
          .setName(value);
        break;
      case Elements.units:
        const selectedUnit = modelCopy.takeUnitsByName(select.name as string);
        selectedUnit.setName(value);
        model.replaceUnitsByName(select.name as string, selectedUnit);
        console.log('AIYA');
        console.log(model);
        break;
      default:
        console.log(`UPDATE ATTRIBUTE: Failed to identify element ${element}`);
    }
    return model;
  }

  updateUnits(
    model: Model,
    element: Elements,
    select: ISearch,
    parentSelect: ISearch,
    value: any,
    attribute: string
  ) {
    const modelCopy = model.clone();
    switch (element) {
      case Elements.variable:
        const parentElement = modelCopy.takeComponentByName(
          parentSelect.name as string,
          true
        );

        const componentElement = parentElement.takeVariableByName(
          select.name as string
        );
        componentElement.setUnitsByName(value);
        model.replaceComponentByName(
          select.name as string,
          parentElement,
          true
        );

        if (this.currentComponent === null) {
          console.log('FM: CurrentComponent is null when setting name');
        } else {
          (this.currentComponent as Variable).setUnitsByName(value);
        }
        break;
      default:
        break;
    }
    return model;
  }

  // Definitely name attribute search
  updateMath(
    model: Model,
    element: Elements,
    select: ISearch,
    parentSelect: ISearch,
    value: any,
    attribute: string
  ) {
    console.log(`FILEMANAGEMENT: Finding ${select.name}`);

    // Modify model
    // and current component parallel
    switch (element) {
      case Elements.component:
        const modelCopy = model.clone();
        const componentElement = modelCopy.takeComponentByName(
          select.name as string,
          true
        );
        // Debugging
        if (componentElement === null) {
          console.log('ITS NULL! !! !');
          console.log(model);
          for (let i = 0; i < model.componentCount(); i += 1) {
            console.log(model.componentByIndex(i).name());
          }
        }
        componentElement.setMath(value);
        model.replaceComponentByName(
          select.name as string,
          componentElement,
          true
        );

        if (this.currentComponent === null) {
          console.log('FM: CurrentComponent is null when setting name');
        } else {
          (this.currentComponent as Component).setMath(value);
        }
        break;
      // case Elements.model:
      //   model.setName(value);
      //   break;
      // case Elements.variable:
      //   model
      //     .takeComponentByName(parentSelect.name as string, true)
      //     .takeVariableByName(select.name as string)
      //     .setName(value);
      //   break;
      // case Elements.units:
      //   model.takeUnitsByName(select.name as string).setName(value);
      //   break;
      default:
        console.log(`UPDATE ATTRIBUTE: Failed to identify element ${element}`);
    }
    return model;
  }

  // Public

  async openedFile(filePath: string, mainWindow: BrowserWindow) {
    const libcellml = await libcellModule();
    const parser = new libcellml.Parser();
    const validator = new libcellml.Validator();
    console.log('MENU: Importing file');
    const { model, errors, warnings, hints } = await this.importFile(
      filePath,
      parser,
      validator
    );
    console.log('MENU: Sending information');
    mainWindow.webContents.send('init-content', model);
    mainWindow.webContents.send('error-reply', {
      errors,
      warnings,
      hints,
    });
    this.updateContent(model);
  }

  // Run once to set up handlers
  setupHandlers() {
    // Used in Spatial view
    // Assume starting valid
    ipcMain.on('update-attribute', async (event: any, arg: IUpdate) => {
      const { element, select, parentSelect, value, attribute } = arg;

      const update = async () => {
        const libcellml = await libcellModule();
        const parser = new libcellml.Parser();
        const printer = new libcellml.Printer();

        console.log('THIS CONTENT');
        console.log(this.getContent());
        let model: Model = parser.parseModel(this.getContent());

        console.log(`FILE MANAGEMENT: Updating ${attribute}:${value}`);

        switch (attribute) {
          case 'name':
            model = this.updateName(
              model,
              element,
              select,
              parentSelect,
              value,
              attribute
            );
            break;
          case 'math':
            model = this.updateMath(
              model,
              element,
              select,
              parentSelect,
              value,
              attribute
            );
            break;
          case 'units':
            model = this.updateUnits(
              model,
              element,
              select,
              parentSelect,
              value,
              attribute
            );
            break;
          default:
            console.log(
              `UPDATE AT'update-content-B'TRIBUTE: Failed to identify attribute ${attribute}`
            );
        }

        console.log(`<<<c ${this.getContent()}`);
        console.log(`>>>p ${printer.printModel(model, false)}`);

        this.updateContent(printer.printModel(model, false));

        event.reply('update-content-B', this.getContent());
      };
      const dbUpdate = update;

      await dbUpdate();
    });

    interface IChildDetail {
      type: Elements;
      attribute: any[];
    }

    // ipcMain.on('notify-backend', (event: any, content: string) => {
    //   if (content !== this.getContent()) {
    //     this.updateContent(content);
    //   }
    // });

    ipcMain.on('add-child', async (event: any, arg: any) => {
      const { child, parent, parentType } = arg;
      parent as ISearch;
      child as IChildDetail;
      const libcellml = await libcellModule();
      console.log(' I GOT A CHILD');

      const parser: Parser = new libcellml.Parser();
      const printer: Printer = new libcellml.Printer();
      const m: Model = parser.parseModel(this.getContent());

      switch (child.type) {
        case Elements.component:
          const newComp: Component = new libcellml.Component();
          console.log('SETTING NAME');
          newComp.setName(child.attribute[0].name as string);
          console.log(newComp);
          // Update current component
          console.log('ADDING TO IT ');
          // (this.currentComponent as Model | Component).addComponent(newComp);
          // Update the truth
          // const parser: Parser = new libcellml.Parser();
          // const printer: Printer = new libcellml.Printer();
          // const m: Model = parser.parseModel(this.getContent());
          m.addComponent(newComp);
          this.updateContent(printer.printModel(m, false));
          // if (parentType === Elements.model) {
          //   m.addComponent(newComp);
          // } else {
          break;

        case Elements.units:
          // const parser1: Parser = new libcellml.Parser();
          // const printer1: Printer = new libcellml.Printer();
          // Make new element with attributes specified by user
          const newUnits: Units = new libcellml.Units();
          newUnits.setName(child.attribute[0].name as string);
          // Get the truth and update it
          // const m1: Model = parser1.parseModel(this.content);
          m.addUnits(newUnits);
          this.updateContent(printer.printModel(m, false));
          break;
        default:
          console.log('FM: Add child - should not reach here');

        // }
      }

      event.reply('update-content-B', this.getContent());
    });

    // Finds the element queried
    // INPUT
    // TODO:
    // OUTPUT
    ipcMain.on(
      'select-element-A',
      (event: any, { element, select }: ISelect) => {
        console.log('FM: Receive select-element');
        this.type = element;
        let prop: IProperties;
        console.log(`FileManagement elementcheck: ${element}`);
        console.log(`SELECT ELEMENT: Looking for ${elmToStr(element)}`);
        switch (element) {
          case Elements.model:
            prop = convertModel(this.getCurrentComponent() as Model);
            break;
          case Elements.component:
            this.findElement(select, element);
            prop = convertComponent(this.getCurrentComponent() as Component);
            break;
          case Elements.units:
            this.findElement(select, element);
            prop = convertUnits(this.getCurrentComponent() as Units);
            break;
          default:
            prop = { attribute: null, children: null };
            console.log('FM: Select Element A Not a valid element.');
            break;
        }
        const selection: ISelection = { element, prop };
        event.reply('res-select-element', selection);
      }
    );

    // Takes the currently selected element
    // INPUT
    // == Element ==
    // An enum that describes the Element of the current cellml element
    // :. Frontend maintains selection
    // OUTPUT
    // Sets the raw truth directly to frontend
    ipcMain.on('get-element', (event: any) => {
      this.printModel();
      let prop: IProperties | null;

      console.log(`LIBCELL: Get Element  ${this.type}`);

      if (this.currentComponent != null) {
        switch (this.type) {
          case Elements.model:
            prop = convertModel(this.getCurrentComponent() as Model);
            break;
          case Elements.component:
            prop = convertComponent(this.getCurrentComponent() as Component);
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

    ipcMain.on('validate-file', async (event: any, file: string) => {
      this.printModel();
      const validate = async () => {
        const libcellml = await libcellModule();
        const parser = new libcellml.Parser();
        const m = parser.parseModel(file);
        const v = new libcellml.Validator();
        v.validateModel(m);
        event.reply('validated-file', v.issueCount() === 0);

        //event.reply('update-content-B', file);

        const noError = v.errorCount();
        const errors = [];
        for (let errorNum = 0; errorNum < noError; errorNum += 1) {
          const issue = v.error(errorNum);
          errors.push({
            desc: issue.description(),
            cause: issue.referenceHeading(),
          });
        }

        const noWarning = v.warningCount();
        const warnings = [];
        for (let warningNum = 0; warningNum < noWarning; warningNum += 1) {
          const warning = v.warning(warningNum);
          warnings.push({
            desc: warning.description(),
            cause: warning.referenceHeading(),
          });
        }

        const noHint = v.hintCount();
        const hints = [];
        for (let i = 0; i < noHint; i += 1) {
          const hint = v.hint(i);
          hints.push({
            desc: hint.description(),
            cause: hint.referenceHeading(),
          });
        }

        errors.push({ desc: 'ERROR BAD', cause: 'test' });
        warnings.push({ desc: 'WARNING MEH', cause: 'test' });
        hints.push({ desc: 'HELP YAY', cause: 'test' });

        console.log('FM: SENDING ERROR REPLY');

        event.reply('error-reply', {
          errors,
          warnings,
          hints,
        });
      };

      const dbValidate = validate;

      dbValidate();
    });
  }
}
