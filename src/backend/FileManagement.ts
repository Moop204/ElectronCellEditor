/* eslint-disable no-case-declarations */
import { ipcMain, BrowserWindow, IpcMainEvent } from "electron";
import { convertSelectedElement } from "./converter/convertElement";
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
  Printer,
} from "../types/ILibcellml";
import {
  IDirectSelect,
  ISearch,
  ISelect,
  ISelection,
  IUpdate,
} from "../types/IQuery";
import {
  obtainIssues,
  validateModel,
} from "../frontend/sidebar/issues/IssueUtilities";
import { EditorElement } from "../types/EditorElement";
import { addChild } from "./addChild/addChild";
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
} from "../utility/variable/getAllVariableNames";
import { getAllUnitsNames } from "./utility/getAllUnitsNames";
import { getAllComponentNames } from "./utility/GetAllComponentNames";
import { updateEvent } from "./updateAttribute/UpdateEvent";
import { RemoveElement } from "./removeChild/removeElement";
import { saveAs, save } from "../utility/save";
import { findElement } from "./utility/FindElement";
import { generateModel } from "./addChild/generateModel";
import { validMathMl } from "./math/validateMathMl";

interface FileIssues {
  model: string;
  issues: IssueDescriptor[];
}
export default class FileManagement {
  content: string;
  currentComponent: Component | Model | Reset | Units | Variable | null;
  type: Elements;
  _cellml: any;
  _printer: Printer;
  _parser: Parser;
  _cellmlLoaded: boolean;
  selectedFile: string;
  // Stop-gap solution until Reset elements are children of ParentedEntity
  componentRoot: Component;
  constructor() {
    this.content = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" >

</model>`;
    this.currentComponent = null;
    this.type = Elements.none;
    this._cellmlLoaded = false;
    this.selectedFile = "";
    this.componentRoot = null;
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
    this._parser = new this._cellml.Parser();
    this._printer = new this._cellml.Printer();
    this._cellmlLoaded = true;
  }

  async updateContentFromModel(m: Model): Promise<void> {
    await this.updateContent(this._printer.printModel(m, true));
  }

  async updateContent(s: string): Promise<void> {
    this.content = s;
    if (!this._cellmlLoaded) {
      await this.init();
    }
    const validator = await validateModel(this, s);
    if (this.type === Elements.none || validator.issueCount() === 0) {
      this.setCurrentComponent(
        this._parser.parseModel(this.content),
        Elements.model
      );
    } else {
      console.log("Invalid update content state");
    }
    if (ipcMain) ipcMain.emit("update-content-b", this.getContent());
  }

  async setContent(s: string): Promise<void> {
    this.content = s;
    this.type = Elements.model;
    if (!this._cellmlLoaded) {
      await this.init();
    }
    this.currentComponent = this._parser.parseModel(this.content);
  }

  async resetToModel(): Promise<IProperties> {
    if (!this._cellmlLoaded) {
      await this.init();
    }
    this.currentComponent = this._parser.parseModel(this.content);
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

  setCurrentComponent(
    currentComponent: EditorElement,
    type: Elements,
    componentRoot?: Component
  ): void {
    if (componentRoot) {
      this.componentRoot = componentRoot;
    }
    this.currentComponent = currentComponent;
    this.type = type;
  }

  getCurrentComponent(): EditorElement {
    return this.currentComponent;
  }

  // Helpers

  update = async (updates: IUpdate[], content: string, fm: FileManagement) => {
    const model: Model = this._parser.parseModel(content);
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
        fm
      );
      fm.setCurrentComponent(newCurrentElement, fm.type);
      await fm.updateContentFromModel(newModel);
    }
  };

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

      this.type = Elements.model;
      this.setCurrentComponent(this._parser.parseModel(file), Elements.model);
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

  // Make a new file
  newFile() {
    this.content = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" >

</model>`;
    this.currentComponent = null;
    this.type = Elements.none;
    this._cellmlLoaded = true;
    this.selectedFile = "";
  }

  // Print out model

  async printModel(): Promise<void> {
    const content = this.getContent();
    console.log("PRINTING OUT MODEL");
    console.log(content);

    if (!this._cellmlLoaded) {
      await this.init();
    }
    const model = this._parser.parseModel(content);
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
    mainWindow.webContents.send("receive-filename", this.selectedFile);
  }

  async saveFile(mainWindow?: BrowserWindow) {
    console.log("GAVE THIS " + this.selectedFile);
    const fileName = await save(this.getContent(), this.selectedFile);
    console.log("GOT THIS " + fileName);
    this.selectedFile = fileName;
    mainWindow?.webContents.send("receive-filename", this.selectedFile);
  }

  async saveAsFile(mainWindow?: BrowserWindow) {
    console.log("GAVE THIS " + this.selectedFile);
    const fileName = await saveAs(this.getContent(), this.selectedFile);
    console.log("GOT THIS " + fileName);
    this.selectedFile = fileName;
    if (mainWindow)
      mainWindow.webContents.send("receive-filename", this.selectedFile);
  }

  // Run once to set up handlers
  setupHandlers(): void {
    if (!ipcMain) return;
    ipcMain.on("new-file", async (event: IpcMainEvent) => {
      this.newFile();
      event.reply("update-content-b", this.getContent());
      event.reply("receive-filename", this.selectedFile);
    });

    ipcMain.on(
      "update-content",
      async (event: IpcMainEvent, newContent: string) => {
        await this.updateContent(newContent);
        this.resetToModel();
        const selection = this.getCurrentAsSelection(this.type);
        event.reply("res-select-element", selection);
      }
    );

    ipcMain.on(
      "save-content",
      async (event: IpcMainEvent, newContent: string) => {
        await this.updateContent(newContent);
        await this.saveFile();
        event.reply("receive-filename", this.selectedFile);
      }
    );

    ipcMain.on("to-parent", async (event: IpcMainEvent) => {
      if (this.type === Elements.model) return;
      const cur = this.getCurrentComponent();
      const parent = cur.parent();
      let newType = Elements.component;
      console.log("Going back to parent");
      console.log(elmToStr(this.type));
      switch (this.type) {
        case Elements.component:
          if (parent instanceof this._cellml.Model) {
            newType = Elements.model;
          }
          break;
        case Elements.units:
          newType = Elements.model;
          break;
      }
      this.setCurrentComponent(parent as EditorElement, newType);
      const selection = this.getCurrentAsSelection(this.type);
      event.reply("res-select-element", selection);
    });

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
        await this.update(updateDescription, this.getContent(), this);
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
        await addChild(this, child, parent, parentType);
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

        // Stopgap solution to lack of parents for Reset
        if (element === Elements.reset) {
          this.componentRoot = this.currentComponent as Component;
        }
        findElement(this, select, element, this.getCurrentComponent());

        const selection = this.getCurrentAsSelection(element);
        event.reply("res-select-element", selection);
      }
    );

    ipcMain.on(
      "direct-find-element",
      (event: IpcMainEvent, { element, select, parent }: IDirectSelect) => {
        const m = generateModel(this._cellml, this.getContent());
        const c = m.componentByName(parent, false);
        findElement(this, select, element, c);
        const selection = this.getCurrentAsSelection(element);
        event.reply("res-select-element", selection);
      }
    );

    ipcMain.on("reset-parent", async (event: IpcMainEvent) => {
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
      await this.updateContent(file);
      if (issues.length === 0 && this.type === Elements.none) {
        this.type = Elements.model;
        const libcellml = this._cellml;
        const m: Model = this._parser.parseModel(file);
        this.currentComponent = m;
        const prop = this.getCurrentAsSelection(this.type);
        event.reply("res-get-element", prop.prop);
      } else {
        console.log(`Issue length: ${issues.length}`);
        console.log(`Current Type: ${this.type}`);
      }
      event.reply("error-reply", issues);
    });

    //ipcMain.emit()

    ipcMain.on("all-components", async (event: IpcMainEvent) => {
      if (!this._cellmlLoaded) {
        await this.init();
      }
      const libcellml = this._cellml;
      const model = this._parser.parseModel(this.content);
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
      event.returnValue = getGlobalVariableNames(this);
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

    ipcMain.on("validate-math", async (event: IpcMainEvent, mathml: string) => {
      const res = validMathMl(this, mathml);
      event.reply("math-validity", res);
    });

    ipcMain.on("parent-name", (event: IpcMainEvent) => {
      event.returnValue = (
        this.getCurrentComponent().parent() as NamedEntity
      ).name();
    });
  }

  destroyHandlers(): void {
    if (ipcMain) ipcMain.removeAllListeners();
  }
}
