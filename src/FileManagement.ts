import { ipcMain } from 'electron';
import { BrowserWindow } from 'electron/main';
import _ from 'underscore';
import { convertComponent, convertModel, importFile } from './AsyncMain';
import { Elements } from './types/Elements';
import {
  Component,
  ImportSource,
  ComponentEntity,
  Model,
  Reset,
  Units,
  Variable,
  Parser,
  Printer,
  Validator,
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
    console.log('!!!CONTENT HAS BEEN UPDATED!!!');
  }

  // Getters and Setters

  getContent() {
    return this.content;
  }

  setCurrentComponent(
    currentComponent: Component | Model | Reset | Units | Variable | null
  ) {
    this.currentComponent = currentComponent;
    const c = currentComponent as Component;

    console.log(`currentComponent is set`);
    console.log(this.currentComponent);
  }

  getCurrentComponent() {
    return this.currentComponent;
  }

  // Helpers

  // Find selected element
  findElement(select: ISearch) {
    const curComp = this.currentComponent as ComponentEntity;
    if (curComp) {
      const { name, index } = select;
      if (name != null) {
        this.currentComponent = curComp.componentByName(name, false);
      } else if (index != null) {
        this.currentComponent = curComp.componentByIndex(index);
      }
    }
  }

  // Import File
  importFile(
    fileLoc: string,
    parser: Parser,
    validator: Validator,
    printer: Printer
  ) {
    console.log(`LIBCELL: Importing file ${fileLoc}`);
    const file: string = fs.readFileSync(fileLoc, 'utf8');
    try {
      console.log(file);
      //    const loadfile: string = fs.readFileSync(tmpArg, 'utf8');
      const model = parser.parseModel(file);
      console.log(`LIBCELL: Parsed Model`);
      console.log(model);
      this.setCurrentComponent(model);
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

      console.log(`LIBCELL: error: ${noError} ${noWarning}`);

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
    switch (element) {
      case Elements.component:
        console.log('COMPONENT');
        console.log(`Name is ${(this.currentComponent as Component).name()}`);
        console.log(`Looking for ${select.name}`);

        const modelCopy = model.clone();

        const componentElement = modelCopy.takeComponentByName(
          select.name as string,
          true
        );
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
      case Elements.variable:
        model
          .takeComponentByName(parentSelect.name as string, true)
          .takeVariableByName(select.name as string)
          .setName(value);
        break;
      case Elements.units:
        model.takeUnitsByName(select.name as string).setName(value);
        break;
      default:
        console.log(`UPDATE ATTRIBUTE: Failed to identify element ${element}`);
    }
    return model;
  }

  // Public

  async openedFile(filePath: string, mainWindow: BrowserWindow) {
    const libcellml = await libcellModule();
    const parser = new libcellml.Parser();
    const printer = new libcellml.Printer();
    const validator = new libcellml.Validator();
    console.log('MENU: Importing file');
    const { model, errors, warnings, hints } = await this.importFile(
      filePath,
      parser,
      validator,
      printer
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
    ipcMain.on('update-content-A', (event, arg: string) => {
      this.content = arg;
      console.log(`update content A ${arg}`);
    });

    // Used in Spatial view
    // Assume starting valid
    ipcMain.on('update-attribute', async (event: any, arg: IUpdate) => {
      const { element, select, parentSelect, value, attribute } = arg;

      const update = async () => {
        const libcellml = await libcellModule();
        const parser = new libcellml.Parser();
        const printer = new libcellml.Printer();

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
          default:
            console.log(
              `UPDATE ATTRIBUTE: Failed to identify attribute ${attribute}`
            );
        }

        console.log(`<<< ${this.getContent()}`);
        console.log(`>>> ${printer.printModel(model, false)}`);

        this.updateContent(printer.printModel(model, false));

        event.reply('update-content-B', this.getContent());
      };
      const dbUpdate = update;

      await dbUpdate();
    });

    // Finds the element queried
    // INPUT
    // TODO:
    // OUTPUT
    ipcMain.on('select-element', (event: any, arg: ISelect) => {
      const { element, select } = arg;
      let prop: IProperties;

      console.log('SELECT ELEMENT: Looking for ');
      switch (element) {
        case Elements.component:
          console.log('COMPONENT');
          this.findElement(select);
          prop = convertComponent(this.getCurrentComponent() as Component);
          break;
        default:
          prop = { attribute: null, children: null };
          console.log('Not a valid element.');
      }
      const selection: ISelection = { element, prop };
      event.reply('res-select-element', selection);
    });

    // Takes the currently selected element
    // INPUT
    // == Element ==
    // An enum that describes the Element of the current cellml element
    // :. Frontend maintains selection
    // OUTPUT
    // Sets the raw truth directly to frontend
    ipcMain.on('get-element', (event: any, element: Elements) => {
      let prop: IProperties;
      console.log(`LIBCELL: Get Element  ${element}`);
      if (this.currentComponent != null) {
        switch (element) {
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
      const validate = async () => {
        const libcellml = await libcellModule();
        const parser = new libcellml.Parser();
        const m = parser.parseModel(file);
        const v = new libcellml.Validator();
        v.validateModel(m);
        event.reply('validated-file', v.issueCount() === 0);

        event.reply('update-content-B', file);

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

      await dbValidate();
    });
  }
}
