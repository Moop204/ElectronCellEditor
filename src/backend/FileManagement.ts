/* eslint-disable no-case-declarations */
import { ipcMain, BrowserWindow, IpcMainEvent } from "electron";
import { convertSelectedElement } from "./converter/ConvertElement";
import { Elements } from "../types/Elements";
import {
  Component,
  ComponentEntity,
  Model,
  Reset,
  Units,
  Variable,
  Parser,
} from "../types/ILibcellml";
import { ISearch, ISelect, ISelection, IUpdate } from "../types/IQuery";
import {
  obtainIssues,
  validateModel,
} from "../frontend/sidebar/issues/IssueUtilities";
import { updateName } from "./updateAttribute/updateName/UpdateName";
import { updateUnits } from "./updateAttribute/UpdateUnits";
import { updateMath } from "./updateAttribute/UpdateMath";
import { EditorElement } from "../types/EditorElement";
import { AddChild } from "./addChild/AddChild";
import { ChildDetail } from "../types/ChildDetail";
import fs from "fs";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

import libCellMLModule from "libcellml.js";
import libCellMLWasm from "libcellml.js/libcellml.wasm";
import { IProperties } from "../types/IProperties";
import { IssueDescriptor } from "../frontend/sidebar/issues/Issue";
import { getAllVariableNames } from "./utility/GetAllVariableNames";
import { getAllUnitsNames } from "./utility/GetAllUnitsNames";
import { getAllComponentNames } from "./utility/GetAllComponentNames";

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

  constructor() {
    this.content = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" 
xmlns:cellml="http://www.cellml.org/cellml/2.0#" 
xmlns:xlink="http://www.w3.org/1999/xlink">

</model>`;
    this.currentComponent = null;
    this.type = Elements.none;
    this._cellmlLoaded = false;
    this.init();
  }

  async init(): Promise<void> {
    this._cellml = await new libCellMLModule({
      locateFile(path: string, prefix: string) {
        if (path.endsWith(".wasm")) {
          return prefix + libCellMLWasm;
        }
        return prefix + path;
      },
    });
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
    ipcMain.emit("update-content-b", this.getContent());
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
      this.getCurrentComponent()
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

  // Find selected element
  findElement(select: ISearch, element: Elements): void {
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

  async importFile(fileLoc: string): Promise<FileIssues> {
    const file: string = fs.readFileSync(fileLoc, "utf8");
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
    const prop = convertSelectedElement(element, this.getCurrentComponent());
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

  // Run once to set up handlers
  setupHandlers(): void {
    ipcMain.on(
      "save-content",
      async (event: IpcMainEvent, newContent: string) => {
        await this.updateContent(newContent);
      }
    );

    // Used in Spatial view
    // Assume starting valid
    ipcMain.on(
      "update-attribute",
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

          const model: Model = parser.parseModel(this.getContent());

          let newModel: Model;
          let newCurrentElement: EditorElement;

          if (attribute === "name") {
            ({ newCurrentElement, newModel } = updateName(
              model,
              element,
              select,
              parentSelect as ISearch,
              value,
              this.getCurrentComponent()
            ));
          } else if (attribute === "units") {
            ({ newModel, newCurrentElement } = updateUnits(
              model,
              element,
              select,
              parentSelect as ISearch,
              value,
              this.getCurrentComponent()
            ));
          } else if (attribute === "math") {
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
          event.reply("update-content-b", this.getContent());
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
        this.findElement(select, element);
        const selection = this.getCurrentAsSelection(element);
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
      console.log(`LIBCELL: Get Element  ${this.type}`);
      const prop = convertSelectedElement(
        this.type,
        this.getCurrentComponent()
      );
      console.log("GetElement: On Get Element");
      console.log(this.getCurrentComponent());
      event.reply("res-get-element", prop);
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
        const prop = convertSelectedElement(
          this.type,
          this.getCurrentComponent()
        );
        console.log("FILE IS AOK AND WE GONNA THROW DOWN A NEW ONE");
        event.reply("res-get-element", prop);
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
  }
}
