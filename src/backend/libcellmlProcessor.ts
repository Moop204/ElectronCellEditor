import {
  Component,
  ComponentEntity,
  ImportSource,
  Model,
  Parser,
  Printer,
  Reset,
  Units,
  Validator,
  Variable,
} from "../types/ILibcellml";
import { CellmlProcessor } from "./CellmlProcessor";
import { initial } from "lodash";

import libCellMLModule from "./mainLibcellml/libcellml.js";
import libCellMLWasm from "./mainLibcellml/libcellml.wasm";
import { Elements } from "../types/Elements";
import { EditorElement } from "../types/EditorElement";

// const libcellModule = require("libcellml.js/libcellml.common");

class LibcellmlProcessor implements CellmlProcessor {
  private _cellml: any;
  private _cellmlLoaded: boolean;
  private _printer: Printer;
  private _parser: Parser;
  private _validator: Validator;
  private _staticVariable: Variable;

  constructor() {
    this._cellmlLoaded = false;
    this.init();
  }

  async init(): Promise<void> {
    if (this._cellmlLoaded) return;
    // @ts-ignore
    this._cellml = await new libCellMLModule({
      locateFile(path: string, prefix: string) {
        if (path.endsWith(".wasm")) {
          return prefix + libCellMLWasm;
        }
        return prefix + path;
      },
    });
    // this._cellml = await libcellModule();
    this._parser = new this._cellml.Parser();
    this._printer = new this._cellml.Printer();
    this._validator = new this._cellml.Validator();
    this._staticVariable = this._cellml.Variable;
    this._cellmlLoaded = true;
  }

  buildModel(name: string): Model {
    const newModel: Model = new this._cellml.Model();
    newModel.setName(name as string);
    return newModel;
  }

  // Create a new Variable
  buildVariable(
    name: string,
    varInterface: string,
    initialValue: string,
    units: string
  ): Variable {
    const newVariable: Variable = new this._cellml.Variable();
    newVariable.setName(name as string);
    newVariable.setUnitsByName(units as string);
    if (varInterface) {
      newVariable.setInterfaceTypeByString(varInterface);
    }
    if (initialValue) {
      newVariable.setInitialValueByString(initialValue as string);
    }
    return newVariable;
  }
  buildComponent(
    name: string,
    source?: string,
    component_ref?: string
  ): Component {
    const newComp: Component = new this._cellml.Component();
    newComp.setName(name as string);
    if (source && component_ref) {
      const importSource: ImportSource = new this._cellml.ImportSource();
      importSource.setUrl(source);
      newComp.setSourceComponent(importSource, component_ref);
    } else if (source || component_ref) {
      console.log(
        "Failed to build a Component. Missing either source or component_ref."
      );
    }
    return newComp;
  }

  // Create a Units element
  // @fm            - State management
  // @name          - Name of new component
  // @imported      - Whether or not the new component is imported
  // @source        - Location of file where component is imported from
  // @component_ref - Name of Units in the source file that is being imported
  buildUnits(name: string, source?: string, component_ref?: string): Units {
    const newUnits: Units = new this._cellml.Units();
    newUnits.setName(name as string);
    const imported = source && component_ref;
    if (imported) {
      const importSource: ImportSource = new this._cellml.ImportSource();
      importSource.setUrl(source);
      newUnits.setSourceUnits(importSource, component_ref);
    }
    return newUnits;
  }

  buildReset(
    v: Variable,
    testVariable: Variable,
    order: number,
    resetValue: string,
    testValue: string
  ): Reset {
    const newReset: Reset = new this._cellml.Reset();
    newReset.setVariable(v);
    newReset.setOrder(order);
    newReset.setTestVariable(testVariable);
    newReset.setResetValue(resetValue);
    newReset.setTestValue(testValue);
    return newReset;
  }

  generateModel(content: string): Model {
    return this._parser.parseModel(content);
  }

  // Add element to another element
  addComponent(element: ComponentEntity, newComponent: Component) {
    element.addComponent(newComponent);
  }

  // Remove
  removeComponent(element: ComponentEntity, targetName: string) {
    const removed = element.removeComponentByName(targetName, true);
    if (!removed) {
      console.log("Failed to remove Component");
    }
    return element;
  }

  // Find elements from Model

  findComponent(model: Model, name: string) {
    return model.componentByName(name, true);
  }

  //// Static ////

  // Remove

  removeConnection(v1: Variable, v2: Variable) {
    return this._staticVariable.removeEquivalence(v1, v2);
  }

  addEquivalence(
    v1: Variable,
    v2: Variable,
    mapId: string,
    connectionId: string
  ): boolean {
    return this._staticVariable.addEquivalenceWithIds(
      v1,
      v2,
      mapId,
      connectionId
    );
  }

  // Validation
  validateModel(m: Model): Validator {
    this._validator.validateModel(m);
    return this._validator;
  }

  // Utility
  printModel(m: Model): string {
    return this._printer.printModel(m, false);
  }

  matchElement(element: EditorElement, type: Elements): boolean {
    let objectType: any;
    switch (type) {
      case Elements.component:
        objectType = this._cellml.Component;
        break;
      case Elements.model:
        objectType = this._cellml.Model;
        break;
      case Elements.reset:
        objectType = this._cellml.Reset;
        break;
      case Elements.variable:
        objectType = this._cellml.Variable;
        break;
      case Elements.units:
        objectType = this._cellml.Units;
        break;
      default:
        return false;
    }
    return element instanceof objectType;
  }
}

export { LibcellmlProcessor };
