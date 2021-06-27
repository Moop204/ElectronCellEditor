import { Elements } from "../../types/Elements";
import { Model, Reset } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";

const updateOrder = (model: Model, fm: FileManagement, value: string) => {
  if (fm.currentComponent) {
    (fm.currentComponent as Reset).setOrder(parseInt(value));
    return {
      newModel: model,
      newCurrentElement: fm.currentComponent as Reset,
    };
  }
  return {
    newModel: model,
    newCurrentElement: model,
  };
};

export { updateOrder };
