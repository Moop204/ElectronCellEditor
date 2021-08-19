import { EditorElement } from "../types/EditorElement";
import { Elements } from "../types/Elements";
import {
  Component,
  ComponentEntity,
  Model,
  Units,
  Validator,
  Variable,
} from "../types/ILibcellml";

interface CellmlProcessor {
  // Create Elements
  buildModel(name: string): Model;
  buildComponent(
    name: string,
    source?: string,
    component_ref?: string
  ): Component;

  removeConnection(v1: Variable, v2: Variable): boolean;
  addEquivalence(
    v1: Variable,
    v2: Variable,
    mapId: string,
    connectionId: string
  ): boolean;
  addComponent(element: ComponentEntity, newComponent: Component): void;
  addVariable(element: Component, newComponent: Variable): void;
  validateModel(m: Model): Validator;
  // addVariable(c: Component, name: string, units: string): Model;
  // addComponent(
  //   m: Model,
  //   name: string,
  //   units: string,
  //   source?: string,
  //   component_ref?: string
  // ): Component;
  // addComponent(
  //   c: Component,
  //   name: string,
  //   units: string,
  //   source?: string,
  //   component_ref?: string
  // ): Model;
  // addUnits(
  //   m: Model,
  //   name: string,
  //   units: string,
  //   source?: string,
  //   component_ref?: string
  // ): Model;
  // addUnit(
  //   u: Units,
  //   units: string,
  //   prefix?: string,
  //   exponent?: string,
  //   multiplier?: string
  // ): Units;
  // addReset(
  //   c: Component,
  //   units: string,
  //   prefix?: string,
  //   exponent?: string,
  //   multiplier?: string
  // ): Component;

  buildVariable(
    name: string,
    units: string,
    varInterface?: string,
    initialValue?: string
  ): Variable;

  buildUnits(name: string, source?: string, component_ref?: string): Units;
  // Utility
  printModel(m: Model): string;
  generateModel(content: string): Model;
  matchElement(element: EditorElement, type: Elements): boolean;
}

export { CellmlProcessor };
