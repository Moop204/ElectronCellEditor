import { Elements } from "../../types/Elements";
import {
  Model,
  Units,
  Component,
  Variable,
  Reset,
} from "../../types/ILibcellml";
import { IProperties } from "../../types/IProperties";
import FileManagement from "../FileManagement";
import { convertComponent } from "./ConvertComponent";
import { convertModel } from "./ConvertModel";
import { convertReset } from "./ConvertReset";
import { convertUnits } from "./ConvertUnits";
import { convertVariable } from "./ConvertVariable";

// Convert currently selected element into properties-ready format
// @selectedElement - Type of the currently selected element
// @curElm - Current element (TODO: Remove and replace with fm)
// @fm - Manager of state
const convertSelectedElement = (
  selectedElement: Elements,
  curElm: Component | Model | Reset | Units | Variable | null,
  fm: FileManagement
) => {
  let prop: IProperties = {
    type: Elements.none,
    attribute: {},
    children: {},
    unit: [],
  };
  if (curElm) {
    switch (selectedElement) {
      case Elements.model:
        prop = convertModel(curElm as Model);
        break;
      case Elements.component:
        prop = convertComponent(curElm as Component);
        break;
      case Elements.units:
        prop = convertUnits(curElm as Units);
        break;
      case Elements.reset:
        prop = convertReset(curElm as Reset);
        break;
      case Elements.variable:
        prop = convertVariable(curElm as Variable);
        break;
      default:
        console.log(
          "ConvertedSelectElement: Failed to identify currently selected element"
        );
    }
  }
  return prop;
};

export { convertSelectedElement };
