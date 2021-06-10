import { Elements } from '../../types/Elements';
import {
  Model,
  Units,
  Component,
  NamedEntity,
  ComponentEntity,
  Variable,
  Reset,
} from '../../types/ILibcellml';
import { IProperties } from '../../types/IProperties';
import { convertComponent } from './ConvertComponent';
import { convertModel } from './ConvertModel';
import { convertReset } from './ConvertReset';
import { convertUnits } from './ConvertUnits';
import { convertVariable } from './ConvertVariable';

const convertSelectedElement = (
  selectedElement: Elements,
  curElm: Component | Model | Reset | Units | Variable | null
) => {
  let prop: IProperties = {
    type: Elements.none,
    attribute: {},
    children: {},
    parent: { name: '', type: Elements.none },
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
          'ConvertedSelectElement: Failed to identify currently selected element'
        );
    }
  }
  return prop;
};

export { convertSelectedElement };
