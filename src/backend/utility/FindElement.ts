import { CellmlModel } from "../model/CellmlModel";
import { CellmlProcessor } from "../CellmlProcessor";
import { EditorElement } from "../../types/EditorElement";
import { Elements } from "../../types/Elements";
import { ComponentEntity, Model, Component } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";

// Find selected element
const findElement = (
  // fm: FileManagement,
  model: CellmlModel,
  select: ISearch,
  element: Elements,
  curElm: EditorElement
): void => {
  if (!model.getCurrent()) {
    return;
  }
  const { name, index } = select;

  switch (element) {
    case Elements.model:
    case Elements.component:
      {
        const curCompEntity = curElm as ComponentEntity;
        if (name != null) {
          const nameComponent = curCompEntity.componentByName(name, false);
          model.setCurrent(nameComponent, Elements.component);
        } else if (index != null) {
          const indexComponent = curCompEntity.componentByIndex(index);
          model.setCurrent(indexComponent, Elements.component);
        }
        model.setType(Elements.component);
      }
      break;
    case Elements.units:
      {
        const curModel = curElm as Model;
        // Parent
        if (name != null) {
          if (curModel.hasUnitsByName(name)) {
            const nameUnits = curModel.unitsByName(name);
            model.setCurrent(nameUnits, Elements.units);
          } else {
            const nameUnits = curModel.unitsByName(name.slice(1));
            model.setCurrent(nameUnits, Elements.units);
          }
        } else if (index != null) {
          const indexUnits = curModel.unitsByIndex(index);
          model.setCurrent(indexUnits, Elements.units);
        }
        model.setType(Elements.units);
      }
      break;
    case Elements.reset:
      {
        const curComp = curElm as Component;
        // Require to find in parent
        if (index != null) {
          model.setCurrent(curComp.reset(index));
        } else {
          console.log("NO INDEX given FOR A RESET");
        }
        model.setType(Elements.reset);
        console.log("ELEMENT OF TYPE RESET");
        console.log(model.getCurrent());
      }
      break;
    case Elements.variable:
      {
        const curComp = curElm as Component;
        model.setCurrent(
          curComp.variableByName(name as string),
          Elements.variable
        );
      }
      console.log("SET TYPE TO VARIABLE");
      break;
    default:
      console.log("findElement failed to figure out which element it was");
      break;
  }
};

export { findElement };
