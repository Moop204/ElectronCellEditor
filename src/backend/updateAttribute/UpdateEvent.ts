import { EditorElement } from "./../../types/EditorElement";
import { Model, Reset, Variable } from "./../../types/ILibcellml";
import { IUpdate } from "./../../types/IQuery";
import { updateExponent } from "./updateExponent";
import { updateInitialValue } from "./updateInitialValue";
import { updateInterface } from "./updateInterface";
import { updateMath } from "./updateMath";
import { updateMultiplier } from "./updateMultiplier";
import { updateName } from "./updateName/updateName";
import { updateOrder } from "./updateOrder";
import { updatePrefix } from "./updatePrefix";
import { updateReference } from "./UpdateReference";
import { updateRemoveConnection } from "./UpdateRemoveConnection";
import { updateResetValue } from "./UpdateResetValue";
import { updateTestValue } from "./updateTestValue";
import { updateTestVariable } from "./UpdateTestVariable";
import { updateUnits } from "./UpdateUnits";
import { updateVariable } from "./UpdateVariable";
import FileManagement from "../FileManagement";

const updateEvent = (
  model: Model,
  { element, select, attribute, value }: IUpdate,
  fm: FileManagement
) => {
  const curElm = fm.getCurrent();
  let newModel = model;
  let newCurrentElement: EditorElement = curElm;

  console.log("UPDATE EVENT " + attribute);
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
    console.log("Ye I'm in order");
    ({ newModel, newCurrentElement } = updateOrder(
      model,
      curElm as Reset,
      value,
      select
    ));
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
  } else if (attribute === "connection") {
    if (value === "remove") {
      ({ newModel, newCurrentElement } = updateRemoveConnection(
        model,
        element,
        select,
        value,
        curElm
      ));
    }
  } else if (attribute === "variable") {
    ({ newModel, newCurrentElement } = updateVariable(
      model,
      curElm as Reset,
      value
    ));
  } else if (attribute === "test_variable") {
    ({ newModel, newCurrentElement } = updateTestVariable(
      model,
      curElm as Reset,
      value,
      fm.componentRoot
    ));
  } else if (attribute === "reset_value") {
    ({ newModel, newCurrentElement } = updateResetValue(
      model,
      curElm as Reset,
      value,
      fm.componentRoot
    ));
  } else if (attribute === "test_value") {
    ({ newModel, newCurrentElement } = updateTestValue(
      model,
      curElm as Reset,
      value,
      fm.componentRoot
    ));
  } else {
    console.log(
      `UPDATE AT'update-content-B'TRIBUTE: Failed to identify attribute ${attribute}`
    );
  }

  console.log("CURELM IS ");
  console.log(curElm);
  return { newModel, newCurrentElement };
};

export { updateEvent };
