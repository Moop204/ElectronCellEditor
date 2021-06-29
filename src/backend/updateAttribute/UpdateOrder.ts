import { EditorElement } from "../../types/EditorElement";
import { Elements } from "../../types/Elements";
import { Model, Reset } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";

const updateOrder = (model: Model, curElm: EditorElement, value: string) => {
  if (curElm) {
    (curElm as Reset).setOrder(parseInt(value));
    return {
      newModel: model,
      newCurrentElement: curElm as Reset,
    };
  }
  return {
    newModel: model,
    newCurrentElement: model,
  };
};

export { updateOrder };
