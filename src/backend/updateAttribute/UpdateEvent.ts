import { EditorElement } from "./../../types/EditorElement";
import { Model, Variable } from "./../../types/ILibcellml";
import { IUpdate } from "./../../types/IQuery";
import { updateExponent } from "./UpdateExponent";
import { updateInitialValue } from "./UpdateInitialValue";
import { updateInterface } from "./UpdateInterface";
import { updateMath } from "./UpdateMath";
import { updateMultiplier } from "./UpdateMultiplier";
import { updateName } from "./updateName/UpdateName";
import { updateOrder } from "./UpdateOrder";
import { updatePrefix } from "./UpdatePrefix";
import { updateReference } from "./UpdateReference";
import { updateUnits } from "./UpdateUnits";

const updateEvent = (
  model: Model,
  { element, select, attribute, value }: IUpdate,
  curElm: EditorElement
) => {
  let newModel = model;
  let newCurrentElement: EditorElement = curElm;

  if (attribute === "name") {
    ({ newCurrentElement, newModel } = updateName(
      model,
      element,
      select,
      value,
      curElm
    ));
  } else if (attribute === "units") {
    ({ newModel, newCurrentElement } = updateUnits(
      model,
      element,
      select,
      value,
      curElm
    ));
  } else if (attribute === "interface") {
    ({ newModel, newCurrentElement } = updateInterface(
      model,
      element,
      select,
      value,
      curElm as Variable
    ));
  } else if (attribute === "math") {
    ({ newModel, newCurrentElement } = updateMath(
      model,
      element,
      select,
      value,
      curElm
    ));
    // TODO: Requires working .parent()
  } else if (attribute === "order") {
    ({ newModel, newCurrentElement } = updateOrder(model, curElm, value));
  } else if (attribute === "prefix") {
    ({ newModel, newCurrentElement } = updatePrefix(
      model,
      element,
      select,
      value,
      curElm
    ));
  } else if (attribute === "exponent") {
    ({ newModel, newCurrentElement } = updateExponent(
      model,
      element,
      select,
      value,
      curElm
    ));
  } else if (attribute === "multiplier") {
    ({ newModel, newCurrentElement } = updateMultiplier(
      model,
      element,
      select,
      value,
      curElm
    ));
  } else if (attribute === "units_reference") {
    ({ newModel, newCurrentElement } = updateReference(
      model,
      element,
      select,
      value,
      curElm
    ));
  } else if (attribute === "interfaceType") {
    ({ newModel, newCurrentElement } = updateInterface(
      model,
      element,
      select,
      value,
      curElm as Variable
    ));
  } else if (attribute === "initialValue") {
    ({ newModel, newCurrentElement } = updateInitialValue(
      model,
      element,
      select,
      value,
      curElm
    ));
  } else {
    console.log(
      `UPDATE AT'update-content-B'TRIBUTE: Failed to identify attribute ${attribute}`
    );
  }
  return { newModel, newCurrentElement };
};

export { updateEvent };
