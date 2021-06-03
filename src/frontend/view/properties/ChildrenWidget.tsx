import { ipcRenderer } from 'electron';
import React, { MouseEventHandler } from 'react';
import { capitaliseFirst } from '../../utils/utility';
import { Elements } from '../../../types/Elements';
import { IChild } from '../../../types/IProperties';
import { ISearch, ISelect } from '../../../types/IQuery';
import { SubHeader } from '../../../frontend/components/SubHeader';
import PropertyChild from './PropertyChild';

const findElement = (elm: Elements, name: string) => {
  const select: ISearch = { index: null, name };
  const query: ISelect = { element: elm, select };
  console.log(select);
  console.log(query);
  switch (elm) {
    case Elements.component:
    case Elements.units:
      console.log('ModelProperties: Request Select-Element');
      console.log(query);
      ipcRenderer.send('find-element-from-children', query);
      break;
    default:
      console.log('Error: Not a valid element type');
  }
  console.log(`ModelProperties: Find!!!!${elm}${name}`);
};

interface IChildrenWidget {
  abstractChildren: Record<string, IChild[]>;
  parentType: Elements;
}

const ChildrenWidget = ({ abstractChildren, parentType }: IChildrenWidget) => {
  if (!abstractChildren) {
    return (
      <div>
        <SubHeader title="Children" />
      </div>
    );
  }

  return (
    <div>
      <SubHeader title="Children" />

      {Object.entries(abstractChildren).map(([parentKey, childrenType]) => {
        console.log(childrenType);
        return (
          <div key={parentKey}>
            {capitaliseFirst(parentKey)}
            {Object.values(childrenType).map((attrType: IChild) => {
              return (
                <PropertyChild
                  title={attrType.name}
                  onClick={() => {
                    findElement(
                      Elements[parentKey as keyof typeof Elements],
                      attrType.name
                    );
                  }}
                  element={parentKey}
                  key={attrType.name}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export { ChildrenWidget };
