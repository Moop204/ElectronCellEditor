import {
  Component,
  ImportSource,
  Model,
  Parser,
  Printer,
} from "../../types/ILibcellml";
import { EditorElement } from "../../types/EditorElement";
import { Elements } from "../../types/Elements";
import { CellmlProcessor } from "./../CellmlProcessor";

// Maintains state of CellML document
class CellmlModel {
  private _type: Elements;
  private _current: EditorElement;
  private _content: string;
  private _selectedFile: string;

  constructor() {
    this._content = `<?xml version="1.0" encoding="UTF-8"?>
    <model xmlns="http://www.cellml.org/cellml/2.0#" >
    
    </model>`;
    this._current = null;
    this._type = Elements.none;
    this._selectedFile = "";
  }

  // Types
  setType(element: Elements) {
    this._type = element;
  }

  getType() {
    return this._type;
  }

  // Content
  setContent(content: string, m: Model) {
    this._content = content;
    this._type = Elements.model;
    this._current = m;
  }

  getContent() {
    return this._content;
  }

  // Current
  setCurrent(currentElement: EditorElement, type = this._type): void {
    this._current = currentElement;
    this.setType(type);
  }

  getCurrent(): EditorElement {
    return this._current;
  }

  // File
  setFile(fileLocation: string): void {
    this._selectedFile = fileLocation;
  }

  getFile(): string {
    return this._selectedFile;
  }

  // Utility
  resetToModel(processor: CellmlProcessor): void {
    const model = processor.generateModel(this._content);
    this.setCurrent(model, Elements.model);
    this.setType(Elements.model);
  }
}

export { CellmlModel };
