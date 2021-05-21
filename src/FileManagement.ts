/* eslint-disable no-case-declarations */
import { ipcMain } from 'electron';
import { BrowserWindow, Event } from 'electron/main';
import _ from 'underscore';
import { convertSelectedElement } from './utility/Converter';
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
import { ISearch, ISelect, ISelection, IUpdate } from './types/IQuery';
import { obtainIssues, validateModel } from './helper/issues';
import updateName from './utility/updating-attribute/UpdateName';
import updateUnits from './utility/updating-attribute/UpdateUnits';
import updateMath from './utility/updating-attribute/UpdateMath';

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
  async importFile(fileLoc: string) {
    const file: string = fs.readFileSync(fileLoc, 'utf8');
    try {
      const validator = await validateModel(file);
      const issues = await obtainIssues(validator);

      // Update file management class
      const libcellml = await libcellModule();
      const p: Parser = new libcellml.Parser();

      this.type = Elements.model;
      this.setCurrentComponent(p.parseModel(file));
      this.updateContent(file);
      const res = {
        model: file,
        ...issues,
      };
      return res;
    } catch (e) {
      console.log('LIBCELLML: Failed to load errors');
      console.log(e);
      return {
        model: file,
        errors: [],
        warnings: [],
        hints: [],
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
    for (let i = 0; i < model.componentCount(); i += 1) {
      console.log(model.componentByIndex(i).name());
    }
  };

  // Public

  async openedFile(filePath: string, mainWindow: BrowserWindow) {
    console.log('MENU: Importing file');
    const { model, errors, warnings, hints } = await this.importFile(filePath);
    console.log('MENU: Sending information');
    mainWindow.webContents.send('init-content', model);
    mainWindow.webContents.send('error-reply', {
      errors,
      warnings,
      hints,
    });
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
        const model: Model = parser.parseModel(this.getContent());

        console.log(`FILE MANAGEMENT: Updating ${attribute}:${value}`);

        let newModel: Model;
        let currentElement: Component | Model | Reset | Units | Variable | null;

        if (attribute === 'name') {
          ({ currentElement, newModel } = updateName(
            model,
            element,
            select,
            parentSelect as ISearch,
            value,
            this.getCurrentComponent()
          ));
        } else if (attribute === 'units') {
          ({ newModel, currentElement } = updateUnits(
            model,
            element,
            select,
            parentSelect as ISearch,
            value,
            this.getCurrentComponent()
          ));
        } else if (attribute === 'math') {
          ({ newModel, currentElement } = updateMath(
            model,
            element,
            select,
            parentSelect as ISearch,
            value,
            this.getCurrentComponent()
          ));
        } else {
          currentElement = this.getCurrentComponent();
          newModel = model;
          console.log(
            `UPDATE AT'update-content-B'TRIBUTE: Failed to identify attribute ${attribute}`
          );
        }
        this.setCurrentComponent(currentElement);
        this.updateContent(printer.printModel(newModel, false));
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
        console.log(`FileManagement elementcheck: ${element}`);
        console.log(`SELECT ELEMENT: Looking for ${elmToStr(element)}`);
        const prop = convertSelectedElement(
          this.type,
          this.getCurrentComponent()
        );
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
      console.log(`LIBCELL: Get Element  ${this.type}`);
      const prop = convertSelectedElement(
        this.type,
        this.getCurrentComponent()
      );
      console.log('GetElement: On Get Element');
      console.log(this.getCurrentComponent());
      event.reply('res-get-element', prop);
    });

    ipcMain.on('validate-file', async (event: Event, file: string) => {
      const validator = await validateModel(file);
      event.reply('validated-file', validator.issueCount() === 0);
      const issues = await obtainIssues(validator);
      console.log(issues);
      event.reply('error-reply', issues);
    });
  }
}
