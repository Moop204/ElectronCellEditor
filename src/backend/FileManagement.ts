/* eslint-disable no-case-declarations */
import { ipcMain } from 'electron';
import { BrowserWindow, Event, IpcMainEvent } from 'electron/main';
import _ from 'lodash';
import { convertSelectedElement } from './converter/Converter';
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
import updateName from './updateAttribute/updatingName/UpdateName';
import updateUnits from './updateAttribute/UpdateUnits';
import updateMath from './updateAttribute/UpdateMath';
import { ICurrentElement } from '../types/ICurrentElement';
import { addChild } from './addChild/AddChild';
import { IChildDetail } from '../types/IChildDetail';

const fs = require('fs');

const libcellModule = require('libcellml.js/libcellml.common');

// Command Pattern
// Handles the truth in the backend
export default class FileManagement {
  content: string;

  currentComponent: Component | Model | Reset | Units | Variable | null;

  type: Elements;

  _cellml: any;
  _cellmlLoaded: boolean;
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
    this._cellmlLoaded = false;
    this.init();
  }

  async init() {
    this._cellml = await libcellModule();
    this._cellmlLoaded = true;
  }

  async updateContent(s: string) {
    this.content = s;
  }

  async setContent(s: string) {
    this.content = s;
    this.type = Elements.model;
    if (!this._cellmlLoaded) {
      await this.init();
    }
    const parser: Parser = new this._cellml.Parser();
    this.currentComponent = parser.parseModel(this.content);
  }

  // Getters and Setters

  getContent() {
    return this.content;
  }

  setCurrentComponent(
    currentComponent: Component | Model | Reset | Units | Variable | null,
    type: Elements
  ) {
    this.currentComponent = currentComponent;
    this.type = type;
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
      const validator = await validateModel(this, file);
      const issues = await obtainIssues(validator);

      // Update file management class
      if (!this._cellmlLoaded) {
        await this.init();
      }
      const cellml = this._cellml;
      const p: Parser = new cellml.Parser();

      this.type = Elements.model;
      this.setCurrentComponent(p.parseModel(file), Elements.model);
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

    if (!this._cellmlLoaded) {
      await this.init();
    }
    const libcellml = this._cellml;
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
          if (!this._cellmlLoaded) {
            await this.init();
          }
          const libcellml = this._cellml;
          const parser = new libcellml.Parser();
          const printer = new libcellml.Printer();

          console.log('THIS CONTENT');
          console.log(this.getContent());
          const model: Model = parser.parseModel(this.getContent());

          console.log(`FILE MANAGEMENT: Updating ${attribute}:${value}`);

          let newModel: Model;
          let newCurrentElement: ICurrentElement;

          if (attribute === 'name') {
            ({ newCurrentElement, newModel } = updateName(
              model,
              element,
              select,
              parentSelect as ISearch,
              value,
              this.getCurrentComponent()
            ));
          } else if (attribute === 'units') {
            ({ newModel, newCurrentElement } = updateUnits(
              model,
              element,
              select,
              parentSelect as ISearch,
              value,
              this.getCurrentComponent()
            ));
          } else if (attribute === 'math') {
            ({ newModel, newCurrentElement } = updateMath(
              model,
              element,
              select,
              parentSelect as ISearch,
              value,
              this.getCurrentComponent()
            ));
          } else {
            newCurrentElement = this.getCurrentComponent();
            newModel = model;
            console.log(
              `UPDATE AT'update-content-B'TRIBUTE: Failed to identify attribute ${attribute}`
            );
          }
          this.setCurrentComponent(newCurrentElement, this.type);
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
      await addChild(this, child, parent, parentType);
      event.reply('update-content-B', this.getContent());
    });

    // Finds the element queried
    // INPUT
    // TODO:
    // OUTPUT
    ipcMain.on(
      'find-element-from-children',
      (event: IpcMainEvent, { element, select }: ISelect) => {
        this.findElement(select, element);
        console.log(`Finding element`);
        console.log(select);
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
      const validator = await validateModel(this, file);
      event.reply('validated-file', validator.issueCount() === 0);
      const issues = await obtainIssues(validator);
      console.log(issues);
      event.reply('error-reply', issues);
    });

    // Gathers all component names from a model recursively
    const getAllComponentNames = (res: string[], parent: ComponentEntity) => {
      const componentCount = parent.componentCount();
      for (let i = 0; i < componentCount; i++) {
        const cur = parent.componentByIndex(i);
        res = getAllComponentNames(res, cur);
        res.push(cur.name());
      }
      return res;
    };

    ipcMain.on('all-components', async (event: IpcMainEvent) => {
      if (!this._cellmlLoaded) {
        await this.init();
      }
      const libcellml = this._cellml;
      const parser: Parser = new libcellml.Parser();
      const model = parser.parseModel(this.content);
      const componentCount = model.componentCount();
      let res: string[] = [];
      res = getAllComponentNames(res, model);
      event.returnValue = res;
    });

    const getAllUnitsNames = async () => {
      if (!this._cellmlLoaded) {
        await this.init();
      }
      const libcellml = this._cellml;
      const parser: Parser = new libcellml.Parser();
      const model = parser.parseModel(this.content);
      const res = [];
      const unitsCount = model.unitsCount();
      for (let i = 0; i < unitsCount; i++) {
        res.push(model.unitsByIndex(i).name());
      }
      return res;
    };

    ipcMain.on('all-units', async (event: IpcMainEvent) => {
      event.returnValue = await getAllUnitsNames();
    });
  }
}
