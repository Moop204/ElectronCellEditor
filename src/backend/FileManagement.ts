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

import { IProperties } from "../types/IProperties";
import { IssueDescriptor } from "../frontend/sidebar/issues/Issue";
import {
  getAllVariableNames,
  getGlobalVariableNames,
  getVariablesofComponent,
} from "../utility/variable/getAllVariableNames";
import { getAllUnitsNames } from "./utility/getAllUnitsNames";
import { getAllComponentNames } from "./utility/getAllComponentNames";
import { updateEvent } from "./updateAttribute/UpdateEvent";
import { removeElement } from "./removeChild/removeElement";
import { saveAs, save } from "../utility/save";
import { findElement } from "./utility/FindElement";
import { generateModel } from "./addChild/generateModel";
import { validMathMl } from "./math/validateMathMl";
import { IMoveTo } from "./moveTo/interfaces";
import { moveTo } from "./moveTo/moveTo";
import { LibcellmlProcessor } from "./libcellmlProcessor";
import { CellmlModel } from "./model/CellmlModel";

interface FileIssues {
  model: string;
  issues: IssueDescriptor[];
}
export default class FileManagement {
  _processor: LibcellmlProcessor;
  _model: CellmlModel;
  // Stop-gap solution until Reset elements are children of ParentedEntity
  componentRoot: Component;
  constructor() {
    this._processor = new LibcellmlProcessor();
    this.init();
    // this._cellmlLoaded = false;
    this.componentRoot = null;
    this._model = new CellmlModel();
  }

  async init(): Promise<void> {
    await this._processor.init();
  }

  async updateContentFromModel(m: Model): Promise<void> {
    await this.updateContent(this._processor.printModel(m));
  }

  async updateContent(s: string): Promise<void> {
    this._model.setContent(s);
    // if (!this._cellmlLoaded) {
    //   await this.init();
    // }
    console.log("PRE UPDATE CONTENT " + elmToStr(this._model.getType()));

    // const validator = validateModel(this._processor, s);
    if (
      this._model.getType() === Elements.none
      // ||validator.issueCount() === 0
    ) {
      this._model.setCurrent(this._processor.generateModel(s), Elements.model);
    } else {
      console.log("Invalid update content state");
    }
    console.log("POST UPDATE CONTENT " + elmToStr(this._model.getType()));
    if (ipcMain) ipcMain.emit("res-update-content", this._model.getContent());
  }

  async resetToModel(): Promise<IProperties> {
    this._model.resetToModel(this._processor);
    const resetProp = convertSelectedElement(
      this._model.getType(),
      this._model.getCurrent(),
      this
    );
    return resetProp;
  }

  // Helpers

  parseModel(content: string): Model {
    return this._processor.generateModel(content);
  }

  displayModel(model: Model): string {
    return this._processor.printModel(model);
  }

  update = async (updates: IUpdate[], content: string, fm: FileManagement) => {
    const model: Model = this._processor.generateModel(content);
    // TODO: Jank fix, refactor properly

    for (const updateDescriptor of updates) {
      if (updateDescriptor.attribute === "name") {
        updateDescriptor.select = {
          name: (this._model.getCurrent() as NamedEntity).name(),
          index: null,
        };
      }
      console.log("descriptor");
      console.log(updateDescriptor);
      console.log("BEFORE FM UPDATEVENT" + elmToStr(fm._model.getType()));

      const { newCurrentElement, newModel } = updateEvent(
        model,
        updateDescriptor,
        fm
      );
      console.log("AFTER FM UPDATEVENT" + elmToStr(fm._model.getType()));
      this._model.setCurrent(newCurrentElement);
      await fm.updateContentFromModel(newModel);
      console.log("POST CONTENTFROMMODEL" + elmToStr(fm._model.getType()));
    }
  };

  // Import File

  async importFile(fileLoc: string): Promise<FileIssues> {
    const file: string = fs.readFileSync(fileLoc, "utf8");
    console.log(file);
    this._model.setFile(fileLoc);
    try {
      const validator = validateModel(this._processor, file);
      const issues = await obtainIssues(validator);

      // Update file management class
      this._model.setCurrent(
        this._processor.generateModel(file),
        Elements.model
      );

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

  // Make a new file
  newFile() {
    this._model = new CellmlModel();
  }

  // If type not provided the currently set type is used
  setCurrent(element: EditorElement, type?: Elements) {
    this._model.setCurrent(element, type);
  }

  getCurrent(): EditorElement {
    return this._model.getCurrent();
  }

  getContent(): string {
    return this._model.getContent();
  }

  // Print out model

  // async printModel(): Promise<void> {
  //   const content = this._model.getContent();
  //   console.log("PRINTING OUT MODEL");
  //   console.log(content);

  //   const model = this._processor.generateModel(content);
  //   for (let i = 0; i < model.componentCount(); i += 1) {
  //     console.log(model.componentByIndex(i).name());
  //   }
  // }

  // Internal
  getCurrentAsSelection(): ISelection {
    // this._model.setType(element);
    const element = this._model.getType();
    const prop = convertSelectedElement(
      element,
      this._model.getCurrent(),
      this
    );
    const selection: ISelection = { element, prop };
    return selection;
  }

  // Public
  async openedFile(filePath: string, mainWindow: BrowserWindow): Promise<void> {
    const { model, issues } = await this.importFile(filePath);
    mainWindow.webContents.send("res-update-content", model);
    mainWindow.webContents.send("error-reply", {
      issues,
    });
    mainWindow.webContents.send("receive-filename", this._model.getFile());
  }

  async saveFile(mainWindow?: BrowserWindow) {
    const fileName = await save(
      this._model.getContent(),
      this._model.getFile()
    );
    console.log("GOT THIS " + fileName);
    this._model.setFile(fileName);
    mainWindow?.webContents.send("receive-filename", this._model.getFile());
  }

  async saveAsFile(mainWindow?: BrowserWindow) {
    const fileName = await saveAs(
      this._model.getContent(),
      this._model.getFile()
    );
    console.log("GOT THIS " + fileName);
    this._model.setFile(fileName);
    if (mainWindow)
      mainWindow.webContents.send("receive-filename", this._model.getFile());
  }

  // Run once to set up handlers
  setupHandlers(): void {
    if (!ipcMain) return;
    ipcMain.on("new-file", async (event: IpcMainEvent) => {
      this.newFile();
      event.reply("res-update-content", this._model.getContent());
      event.reply("receive-filename", this._model.getFile());
    });

    ipcMain.on(
      "update-content",
      async (event: IpcMainEvent, newContent: string) => {
        await this.updateContent(newContent);
        this.resetToModel();
        const selection = this.getCurrentAsSelection();
        event.reply("res-select-element", selection);
      }
    );

    ipcMain.on(
      "save-content",
      async (event: IpcMainEvent, newContent: string) => {
        await this.updateContent(newContent);
        await this.saveFile();
        event.reply("receive-filename", this._model.getFile());
      }
      // const type = this._model.getType();
      // if (type === Elements.model) return;
      // const cur = this._model.getCurrent();
      // const parent = cur.parent();
      // console.log("To Parent");
      // console.log("From " + elmToStr(type));
      // let newType = Elements.component;
      // switch (type) {
      //   case Elements.component:
      //     if (
      //       this._processor.matchElement(
      //         parent as EditorElement,
      //         Elements.model
      //       )
      //     ) {
      //       newType = Elements.model;
      //     }
      //     break;
      //   case Elements.units:
      //     newType = Elements.model;
      //     break;
      // }
      // this._model.setCurrent(parent as EditorElement, newType);
      // const selection = this.getCurrentAsSelection();
      // event.reply("res-select-element", selection);
    );

    // Used in Spatial view
    // Assume starting valid
    ipcMain.on(
      "update-attribute",
      async (event: IpcMainEvent, updateDescription: IUpdate[]) => {
        console.log("Update Received");
        console.log(updateDescription);
        await this.update(updateDescription, this._model.getContent(), this);
        if (ipcMain) {
          event.reply("res-update-content", this._model.getContent());
          //event.returnValue("a");
        }
        const prop = this.getCurrentAsSelection();
        if (ipcMain) event.reply("res-get-element", prop.prop);
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
      async (event: IpcMainEvent, { child, parentType }: IAddChild) => {
        await addChild(this, child, parentType);
        event.reply("res-update-content", this._model.getContent());
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
          this.componentRoot = this._model.getCurrent() as Component;
        }
        findElement(this._model, select, element, this._model.getCurrent());
        const selection = this.getCurrentAsSelection();
        event.reply("res-select-element", selection);
      }
    );

    // ipcMain.on("reset-parent", async (event: IpcMainEvent) => {
    //   const resetProp = await this.resetToModel();
    //   event.reply("res-get-element", resetProp);
    // });

    // Takes the currently selected element
    // INPUT
    // == Element ==
    // An enum that describes the Element of the current cellml element
    // :. Frontend maintains selection
    // OUTPUT
    // Sets the raw truth directly to frontend
    ipcMain.on("get-element", (event: IpcMainEvent) => {
      const prop = this.getCurrentAsSelection();
      event.reply("res-get-element", prop.prop);
    });

    ipcMain.on("validate-file", async (event: IpcMainEvent, file: string) => {
      const validator = validateModel(this._processor, file);
      event.reply("validated-file", validator.issueCount() === 0);
      const issues = await obtainIssues(validator);
      await this.updateContent(file);
      if (issues.length === 0 && this._model.getType() === Elements.none) {
        const m: Model = this._processor.generateModel(file);
        this._model.setCurrent(m, Elements.model);

        const prop = this.getCurrentAsSelection();
        event.reply("res-get-element", prop.prop);
      } else {
        console.log(`Issue length: ${issues.length}`);
      }
      event.reply("error-reply", issues);
    });

    //ipcMain.emit()

    ipcMain.on("all-components", async (event: IpcMainEvent) => {
      const model = this._processor.generateModel(this._model.getContent());
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
        removeElement(this, element, select);
        const prop = this.getCurrentAsSelection();
        event.reply("res-get-element", prop.prop);
        event.reply("res-update-content", this._model.getContent());
      }
    );

    ipcMain.on("validate-math", async (event: IpcMainEvent, mathml: string) => {
      const res = validMathMl(this._processor, mathml);
      event.reply("math-validity", res);
    });

    // ipcMain.on("parent-name", (event: IpcMainEvent) => {
    //   event.returnValue = (
    //     this._model.getCurrent().parent() as NamedEntity
    //   ).name();
    // });

    ipcMain.on(
      "select-variables",
      (event: IpcMainEvent, componentName: string) => {
        const content = this._model.getContent();
        const m = this._processor.generateModel(content);
        const c = m.componentByName(componentName, true);
        event.returnValue = c ? getVariablesofComponent(c) : [];
      }
    );

    ipcMain.on("move-to", (event: IpcMainEvent, move: IMoveTo) => {
      console.log("RECEIEVED");
      moveTo(move, this);
      console.log("POST MOVE");
      console.log(elmToStr(this._model.getType()));
      const selection = this.getCurrentAsSelection();
      console.log("ABOUT TO REPLY");
      event.reply("res-select-element", selection);
    });
  }

  destroyHandlers(): void {
    if (ipcMain) ipcMain.removeAllListeners();
  }
}
