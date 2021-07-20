/* eslint-disable no-case-declarations */
import { ipcMain, BrowserWindow, IpcMainEvent } from "electron";
import { convertSelectedElement } from "./converter/ConvertElement";
import { Elements, elmToStr } from "../types/Elements";
import {
  Component,
  ComponentEntity,
  Model,
  Reset,
  Units,
  Variable,
  Parser,
  NamedEntity,
} from "../types/ILibcellml";
import { ISearch, ISelect, ISelection, IUpdate } from "../types/IQuery";
import {
  obtainIssues,
  validateModel,
} from "../frontend/sidebar/issues/IssueUtilities";
import { EditorElement } from "../types/EditorElement";
import { AddChild } from "./addChild/AddChild";
import { ChildDetail } from "../types/ChildDetail";
const fs = require("fs");

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

const libcellModule = require("libcellml.js/libcellml.common");

// import libCellMLModule from "./mainLibcellml/libcellml.js";
// import libCellMLWasm from "./mainLibcellml/libcellml.wasm";

import { IProperties } from "../types/IProperties";
import { IssueDescriptor } from "../frontend/sidebar/issues/Issue";
import {
  getAllVariableNames,
  getGlobalVariableNames,
} from "./utility/GetAllVariableNames";
import { getAllUnitsNames } from "./utility/GetAllUnitsNames";
import { getAllComponentNames } from "./utility/GetAllComponentNames";
import { updateEvent } from "./updateAttribute/UpdateEvent";
import { RemoveElement } from "./removeChild/removeElement";
import { SaveAs } from "./../utility/Save";

interface FileIssues {
  model: string;
  issues: IssueDescriptor[];
}
export default class FileManagement {
  content: string;
  currentComponent: Component | Model | Reset | Units | Variable | null;
  type: Elements;
  _cellml: any;
  _cellmlLoaded: boolean;
  selectedFile: string;

  constructor() {
    this.content = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" 
xmlns:cellml="http://www.cellml.org/cellml/2.0#" 
xmlns:xlink="http://www.w3.org/1999/xlink">

</model>`;
    this.currentComponent = null;
    this.type = Elements.none;
    this._cellmlLoaded = false;
    this.selectedFile = "";
    this.init();
  }

  async init(): Promise<void> {
    if (this._cellmlLoaded) return;
    // @ts-ignore
    // this._cellml = await new libCellMLModule({
    //   locateFile(path: string, prefix: string) {
    //     if (path.endsWith(".wasm")) {
    //       return prefix + libCellMLWasm;
    //     }
    //     return prefix + path;
    //   },
    // });
    this._cellml = await libcellModule();
    this._cellmlLoaded = true;
  }

  async updateContent(s: string): Promise<void> {
    this.content = s;
    if (!this._cellmlLoaded) {
      await this.init();
    }
    const validator = await validateModel(this, s);
    if (this.type === Elements.none && validator.issueCount() === 0) {
      const parser: Parser = new this._cellml.Parser();
      this.setCurrentComponent(parser.parseModel(this.content), Elements.model);
    }
    if (ipcMain) ipcMain.emit("update-content-b", this.getContent());
  }

  async setContent(s: string): Promise<void> {
    this.content = s;
    this.type = Elements.model;
    if (!this._cellmlLoaded) {
      await this.init();
    }
    const parser: Parser = new this._cellml.Parser();
    this.currentComponent = parser.parseModel(this.content);
  }

  async resetToModel(): Promise<IProperties> {
    if (!this._cellmlLoaded) {
      await this.init();
    }
    const parser: Parser = new this._cellml.Parser();
    this.currentComponent = parser.parseModel(this.content);
    this.type = Elements.model;
    const resetProp = convertSelectedElement(
      this.type,
      this.getCurrentComponent(),
      this
    );
    return resetProp;
  }

  // Getters and Setters

  getContent(): string {
    return this.content;
  }

  setCurrentComponent(currentComponent: EditorElement, type: Elements): void {
    this.currentComponent = currentComponent;
    this.type = type;
  }

  getCurrentComponent(): EditorElement {
    return this.currentComponent;
  }

  // Helpers

  update = async (
    updates: IUpdate[],
    libcellml: any,
    content: string,
    curElm: EditorElement,
    fm: FileManagement
  ) => {
    const parser = new libcellml.Parser();
    const printer = new libcellml.Printer();

    const model: Model = parser.parseModel(content);

    // TODO: Jank fix, refactor properly

    for (const updateDescriptor of updates) {
      if (updateDescriptor.attribute === "name") {
        updateDescriptor.select = {
          name: (this.getCurrentComponent() as NamedEntity).name(),
          index: null,
        };
      }
      console.log("descriptor");
      console.log(updateDescriptor);
      const { newCurrentElement, newModel } = updateEvent(
        model,
        updateDescriptor,
        curElm
      );
      fm.setCurrentComponent(newCurrentElement, fm.type);
      await fm.updateContent(printer.printModel(newModel, false));
    }
  };

  // Find selected element
  findElement(select: ISearch, element: Elements): void {
    if (!this.currentComponent) {
      return;
    }
    const { name, index } = select;

    switch (element) {
      case Elements.model:
      case Elements.component:
        {
          const curComp = this.currentComponent as ComponentEntity;
          if (name != null) {
            this.currentComponent = curComp.componentByName(name, false);
          } else if (index != null) {
            this.currentComponent = curComp.componentByIndex(index);
          }
          this.type = Elements.component;
        }
        break;
      case Elements.units:
        {
          // Parent
          const curComp = this.currentComponent as Model;
          if (name != null) {
            if (curComp.hasUnitsByName(name)) {
              this.currentComponent = curComp.unitsByName(name);
            } else {
              this.currentComponent = curComp.unitsByName(name.slice(1));
            }
          } else if (index != null) {
            this.currentComponent = curComp.unitsByIndex(index);
          }
          this.type = Elements.units;
        }
        break;
      case Elements.reset:
        {
          // Require to find in parent
          const curComp = this.currentComponent as Component;
          if (index != null) {
            this.currentComponent = curComp.reset(index);
          } else {
            console.log("NO INDEX given FOR A RESET");
          }
          this.type = Elements.reset;
          console.log("ELEMENT OF TYPE RESET");
          console.log(this.currentComponent);
        }
        break;
      case Elements.variable:
        {
          const curComp = this.getCurrentComponent() as Component;
          this.setCurrentComponent(
            curComp.variableByName(name as string),
            Elements.variable
          );
        }
        console.log("SET TYPE TO VARIABLE");
        break;
      default:
        console.log("findElement failed to figure out which element it was");
        break;
    }
  }

  // Import File

  async importFile(fileLoc: string): Promise<FileIssues> {
    const file: string = fs.readFileSync(fileLoc, "utf8");
    console.log(file);
    this.selectedFile = fileLoc;
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
      console.log(this.content);
      return res;
    } catch (e) {
      console.log("LIBCELLML: Failed to load errors");
      console.log(e);
      return {
        model: file,
        issues: [],
      };
    }
  }

  // Print out model

  async printModel(): Promise<void> {
    const content = this.getContent();
    console.log("PRINTING OUT MODEL");
    console.log(content);

    if (!this._cellmlLoaded) {
      await this.init();
    }
    const libcellml = this._cellml;
    const parser = new libcellml.Parser();
    const model = parser.parseModel(content);
    for (let i = 0; i < model.componentCount(); i += 1) {
      console.log(model.componentByIndex(i).name());
    }
  }

  // Internal
  getCurrentAsSelection(element: Elements): ISelection {
    this.type = element;
    const prop = convertSelectedElement(
      element,
      this.getCurrentComponent(),
      this
    );
    const selection: ISelection = { element, prop };
    return selection;
  }

  // Public

  async openedFile(filePath: string, mainWindow: BrowserWindow): Promise<void> {
    const { model, issues } = await this.importFile(filePath);
    mainWindow.webContents.send("init-content", model);
    mainWindow.webContents.send("error-reply", {
      issues,
    });
  }

  async saveFile() {
    console.log("GAVE THIS " + this.selectedFile);
    const fileName = await SaveAs(this.getContent(), this.selectedFile);
    console.log("GOT THIS " + fileName);
    this.selectedFile = fileName;
  }

  // Run once to set up handlers
  setupHandlers(): void {
    ipcMain.on(
      "save-content",
      async (event: IpcMainEvent, newContent: string) => {
        await this.updateContent(newContent);
        this.saveFile();
      }
    );

    // Used in Spatial view
    // Assume starting valid
    ipcMain.on(
      "update-attribute",
      async (event: IpcMainEvent, updateDescription: IUpdate[]) => {
        if (!this._cellmlLoaded) {
          await this.init();
        }
        console.log("Update Received");
        console.log(updateDescription);
        await this.update(
          updateDescription,
          this._cellml,
          this.getContent(),
          this.getCurrentComponent(),
          this
        );
        if (ipcMain) {
          event.reply("update-content-b", this.getContent());
          //event.returnValue("a");
        }
      }
    );

    // ipcMain.on('notify-backend', (event: any, content: string) => {
    //   if (content !== this.getContent()) {
    //     this.updateContent(content);
    //   }
    // });

    interface IAddChild {
      child: ChildDetail;
      parent: ISearch;
      parentType: Elements;
    }

    ipcMain.on(
      "add-child",
      async (event: IpcMainEvent, { child, parent, parentType }: IAddChild) => {
        await AddChild(this, child, parent, parentType);
        event.reply("update-content-b", this.getContent());
      }
    );

    // Finds the element queried
    // INPUT
    // TODO:
    // OUTPUT
    ipcMain.on(
      "find-element-from-children",
      (event: IpcMainEvent, { element, select }: ISelect) => {
        console.log(`Looking for ${elmToStr(element)}`);
        console.log(select);

        this.findElement(select, element);

        console.log(`HEY LOOK ${elmToStr(this.type)}`);
        const selection = this.getCurrentAsSelection(element);
        console.log("LOO AT ME I AH ERE");
        console.log(selection);
        event.reply("res-select-element", selection);
      }
    );

    ipcMain.on("resetParent", async (event: IpcMainEvent) => {
      const resetProp = await this.resetToModel();
      event.reply("res-get-element", resetProp);
    });

    // Takes the currently selected element
    // INPUT
    // == Element ==
    // An enum that describes the Element of the current cellml element
    // :. Frontend maintains selection
    // OUTPUT
    // Sets the raw truth directly to frontend
    ipcMain.on("get-element", (event: IpcMainEvent) => {
      const prop = this.getCurrentAsSelection(this.type);
      event.reply("res-get-element", prop.prop);
    });

    ipcMain.on("validate-file", async (event: IpcMainEvent, file: string) => {
      const validator = await validateModel(this, file);
      event.reply("validated-file", validator.issueCount() === 0);
      const issues = await obtainIssues(validator);
      if (issues.length === 0 && this.type === Elements.none) {
        this.type = Elements.model;
        const libcellml = this._cellml;
        const parser: Parser = new libcellml.Parser();
        const m: Model = parser.parseModel(file);
        this.currentComponent = m;
        const prop = this.getCurrentAsSelection(this.type);
        event.reply("res-get-element", prop.prop);
      } else {
        console.log(`Issue length: ${issues.length}`);
        console.log(`Current Type: ${this.type}`);
      }
      event.reply("error-reply", issues);
    });

    ipcMain.on("all-components", async (event: IpcMainEvent) => {
      if (!this._cellmlLoaded) {
        await this.init();
      }
      const libcellml = this._cellml;
      const parser: Parser = new libcellml.Parser();
      const model = parser.parseModel(this.content);
      let res: string[] = [];
      res = getAllComponentNames(res, model);
      event.returnValue = res;
    });

    // Returns a list of all units for the model
    ipcMain.on("all-units", async (event: IpcMainEvent) => {
      event.returnValue = await getAllUnitsNames(this);
    });

    // Returns a list of all valid variables for the currently selected element
    // Assertions:
    // Currently selected element is a component
    ipcMain.on("all-variable", async (event: IpcMainEvent) => {
      event.returnValue = await getAllVariableNames(this);
    });

    // Returns a list of all variables in the model
    // Placeholder until bindings for equivalence is completed
    ipcMain.on("global-variable", async (event: IpcMainEvent) => {
      event.returnValue = await getGlobalVariableNames(this);
    });

    ipcMain.on(
      "delete-element",
      async (event: IpcMainEvent, { element, select }: ISelect) => {
        RemoveElement(this, element, select);
        const prop = this.getCurrentAsSelection(this.type);
        event.reply("res-get-element", prop.prop);
        event.reply("update-content-b", this.getContent());
      }
    );

    ipcMain.on("parent-name", (event: IpcMainEvent) => {
      event.returnValue = (
        this.getCurrentComponent().parent() as NamedEntity
      ).name();
    });
  }

  destroyHandlers(): void {
    ipcMain.removeAllListeners();
  }
}
