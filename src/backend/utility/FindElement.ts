import { EditorElement } from "../../types/EditorElement";
import { Elements } from "../../types/Elements";
import { ComponentEntity, Model, Component } from "../../types/ILibcellml";
import { ISearch } from "../../types/IQuery";
import FileManagement from "../FileManagement";

// Find selected element
const findElement = (
  fm: FileManagement,
  select: ISearch,
  element: Elements,
  curElm: EditorElement
): void => {
  if (!fm.currentComponent) {
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
          fm.setCurrentComponent(nameComponent, Elements.component);
        } else if (index != null) {
          const indexComponent = curCompEntity.componentByIndex(index);
          fm.setCurrentComponent(indexComponent, Elements.component);
        }
        fm.type = Elements.component;
      }
      break;
    case Elements.units:
      {
        const curModel = curElm as Model;
        // Parent
        if (name != null) {
          if (curModel.hasUnitsByName(name)) {
            const nameUnits = curModel.unitsByName(name);
            fm.setCurrentComponent(nameUnits, Elements.units);
          } else {
            const nameUnits = curModel.unitsByName(name.slice(1));
            fm.setCurrentComponent(nameUnits, Elements.units);
          }
        } else if (index != null) {
          const indexUnits = curModel.unitsByIndex(index);
          fm.setCurrentComponent(indexUnits, Elements.units);
        }
        fm.type = Elements.units;
      }
      break;
    case Elements.reset:
      {
        const curComp = curElm as Component;
        // Require to find in parent
        if (index != null) {
          fm.currentComponent = curComp.reset(index);
        } else {
          console.log("NO INDEX given FOR A RESET");
        }
        fm.type = Elements.reset;
        console.log("ELEMENT OF TYPE RESET");
        console.log(fm.currentComponent);
      }
      break;
    case Elements.variable:
      {
        const curComp = curElm as Component;
        fm.setCurrentComponent(
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
