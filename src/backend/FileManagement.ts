/* eslint-disable no-case-declarations */
import { ipcMain } from 'electron';
import { BrowserWindow, Event, IpcMainEvent } from 'electron/main';
import _ from 'lodash';
import { convertSelectedElement } from './Converter';
import { Elements, elmToStr } from '../types/Elements';
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
  InterfaceType,
} from '../types/ILibcellml';
import { ISearch, ISelect, ISelection, IUpdate } from '../types/IQuery';
import { obtainIssues, validateModel } from '../frontend/view/issues/issues';
import updateName from './updatingAttribute/UpdateName';
import updateUnits from './updatingAttribute/UpdateUnits';
import updateMath from './updatingAttribute/UpdateMath';

const fs = require('fs');

const libcellModule = require('libcellml.js/libcellml.common');

interface IChildDetail {
  type: Elements;
  attribute: any[];
}

// Command Pattern
// Handles the truth in the backend
export default class FileManagement {
  content: string;

  currentComponent: Component | Model | Reset | Units | Variable | null;

  type: Elements;

  // // combine parent and child name
  // variables: Record<string, Variable>;

  // variableList: Variable[];

  // variableParentList: string[];

  constructor() {
    this.content = '';
    this.currentComponent = null;
    this.type = Elements.model;
    // this.variableList = [];
    // this.variableParentList = [];
  }

  async updateContent(s: string) {
    this.content = s;

    // const libcellml = await libcellModule();
    // const parser: Parser = new libcellml.Parser();
    // const printer: Printer = new libcellml.Printer();
    // const m: Model = parser.parseModel(s);
    // const numComponent = m.componentCount();
    // this.variableList = [];
    // this.variableParentList = [];
    // for (let ci = 0; ci < numComponent; ci += 1) {
    //   const comp = m.componentByIndex(ci);
    //   for (let vi = 0; vi < comp.variableCount(); vi += 1) {
    //     const variable = comp.variableByIndex(vi);
    //     this.variableList.push(variable);
    //     this.variableParentList.push(comp.name());
    //   }
    // }
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
      await this.updateContent(file);
      const res = {
        model: file,
        issues: issues,
      };
      return res;
    } catch (e) {
      console.log('LIBCELLML: Failed to load errors');
      console.log(e);
      return {
        model: file,
        issues: [],
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

  // Internal
  getCurrentAsSelection = (element: Elements) => {
    this.type = element;
    const prop = convertSelectedElement(element, this.getCurrentComponent());
    const selection: ISelection = { element, prop };
    return selection;
  };

  addChild = async (
    child: IChildDetail,
    parent: ISearch,
    parentType: Elements
  ) => {
    const libcellml = await libcellModule();
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
        if (parentType === Elements.model) {
          m.addComponent(newComp);
        } else {
          const parentComponent = m.componentByName(
            parent.name as string,
            true
          );
          parentComponent.addComponent(newComp);
          m.replaceComponentByName(
            parent.name as string,
            parentComponent,
            true
          );
        }
        this.updateContent(printer.printModel(m, false));
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
        await this.updateContent(printer.printModel(m, false));
        break;
      case Elements.variable: {
        // Create Variable
        const newVariable: Variable = new libcellml.Variable();
        newVariable.setName(child.attribute[0].name as string);
        // TODO: CASE WHERE CUSTOM UNITS USED
        newVariable.setUnitsByName(child.attribute[0].units as string);
        if (child.attribute[0].interface) {
          newVariable.setInterfaceTypeByInterfaceType(
            child.attribute[0].interface as InterfaceType
          );
        }
        if (child.attribute[0].initialValue) {
          newVariable.setInitialValueByString(
            child.attribute[0].initialValue as string
          );
        }

        // Add to Model
        const parentComponent = m.componentByName(parent.name as string, true);
        parentComponent.addVariable(newVariable);
        m.replaceComponentByName(parent.name as string, parentComponent, true);
        await this.updateContent(printer.printModel(m, false));
        break;
      }
      // case Elements.reset: {
      //   // Make reset element
      //   const newReset: Reset = new libcellml.Reset();
      //   // TODO Make sure it gets sent
      //   newReset.setVariable(this.variableList[child.attribute[0].variable]);
      //   newReset.setOrder(child.attribute[0].order);
      //   newReset.setTestVariable(
      //     this.variableList[child.attribute[0].testVariable]
      //   );
      //   newReset.setResetValue(child.attribute[0].resetValue);
      //   newReset.setTestValue(child.attribute[0].testValue);
      //   // Attach it to parent component
      //   const parentComponent = m.componentByName(parent.name as string, true);
      //   parentComponent.addReset(newReset);
      //   m.replaceComponentByName(parent.name as string, parentComponent, true);
      //   this.updateContent(printer.printModel(m, false));
      //   break;
      // }
      default:
        console.log('FM: Add child - should not reach here');

      // }
    }
  };

  // Public

  async openedFile(filePath: string, mainWindow: BrowserWindow) {
    console.log('MENU: Importing file');
    const { model, issues } = await this.importFile(filePath);
    console.log('MENU: Sending information');
    mainWindow.webContents.send('init-content', model);
    mainWindow.webContents.send('error-reply', {
      issues,
    });
  }

  // Run once to set up handlers
  setupHandlers() {
    // Used in Spatial view
    // Assume starting valid
    ipcMain.on(
      'update-attribute',
      async (
        event: IpcMainEvent,
        { element, select, parentSelect, value, attribute }: IUpdate
      ) => {
        const update = async () => {
          const libcellml = await libcellModule();
          const parser = new libcellml.Parser();
          const printer = new libcellml.Printer();

          console.log('THIS CONTENT');
          console.log(this.getContent());
          const model: Model = parser.parseModel(this.getContent());

          console.log(`FILE MANAGEMENT: Updating ${attribute}:${value}`);

          let newModel: Model;
          let currentElement:
            | Component
            | Model
            | Reset
            | Units
            | Variable
            | null;

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
          await this.updateContent(printer.printModel(newModel, false));
          event.reply('update-content-B', this.getContent());
        };
        const dbUpdate = update;

        await dbUpdate();
      }
    );

    // ipcMain.on('notify-backend', (event: any, content: string) => {
    //   if (content !== this.getContent()) {
    //     this.updateContent(content);
    //   }
    // });

    ipcMain.on('add-child', async (event: IpcMainEvent, arg: any) => {
      const { child, parent, parentType } = arg;
      parent as ISearch;
      child as IChildDetail;
      await this.addChild(child, parent, parentType);
      event.reply('update-content-B', this.getContent());
    });

    // Finds the element queried
    // INPUT
    // TODO:
    // OUTPUT
    ipcMain.on(
      'select-element-A',
      (event: IpcMainEvent, { element, select }: ISelect) => {
        const selection = this.getCurrentAsSelection(element);
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
    ipcMain.on('get-element', (event: IpcMainEvent) => {
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

    ipcMain.on('validate-file', async (event: IpcMainEvent, file: string) => {
      const validator = await validateModel(file);
      event.reply('validated-file', validator.issueCount() === 0);
      const issues = await obtainIssues(validator);
      console.log(issues);
      event.reply('error-reply', issues);
    });
  }
}
