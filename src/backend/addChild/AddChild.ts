import { Elements } from '../../types/Elements';
import { IChildDetail } from '../../types/IChildDetail';
import {
  Parser,
  Printer,
  Model,
  Units,
  Variable,
  InterfaceType,
  Component,
} from '../../types/ILibcellml';
import { ISearch } from '../../types/IQuery';
import FileManagement from '../FileManagement';
import { AddChildComponent } from './AddChildComponent';
import { AddChildReset } from './AddChildReset';
import { AddChildUnits } from './AddChildUnits';
import { AddChildVariable } from './AddChildVariable';

const addChild = async (
  fm: FileManagement,
  child: IChildDetail,
  parent: ISearch,
  parentType: Elements
) => {
  if (!fm._cellmlLoaded) {
    await fm.init();
  }

  switch (child.type) {
    case Elements.component:
      await AddChildComponent(fm, parent, parentType, child);
      break;
    case Elements.units:
      await AddChildUnits(fm, child);
      break;
    case Elements.variable: {
      await AddChildVariable(fm, parent, child);
      break;
    }
    case Elements.reset: {
      await AddChildReset(fm, child, parent);
      break;
    }
    default:
      console.log('FM: Add child - should not reach here');
    // }
  }
};

export { addChild };
