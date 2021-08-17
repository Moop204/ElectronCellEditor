import {
  Component,
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
    varInterface: string,
    initialValue: string,
    units: string
  ): Variable;

  buildUnits(
    name: string,
    imported: boolean,
    source: string,
    component_ref: string
  ): Units;

  // Utility
  printModel(m: Model): string;
  generateModel(content: string): Model;
}

export { CellmlProcessor };
