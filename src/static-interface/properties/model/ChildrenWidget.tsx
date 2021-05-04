import { Grid, Button } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import React from 'react';
import { capitaliseFirst } from '../../../helper/utility';
import { Elements } from '../../../types/Elements';
import { IChild } from '../../../types/IProperties';
import { ISearch, ISelect } from '../../../types/IQuery';
import { SubHeader } from '../../SubHeader';

interface IPropertyChild {
  title: string;
  onClick: ClickEventHandler<HTMLInputElement>;
}

const findElement = (elm: Elements, name: string) => {
  const select: ISearch = { index: null, name };
  const query: ISelect = { element: elm, select };
  switch (elm) {
    case Elements.component:
      ipcRenderer.send('select-element-A', query);
      break;
    default:
      console.log('Error: Not a valid element type');
  }
  console.log(`ChildrenWidget: Find!!!!${elm}${name}`);
};

const PropertyChild = (props: IPropertyChild) => {
  const { onClick, title } = props;

  return (
    <Grid container item direction="row">
      <Button onClick={onClick}>{title}</Button>
    </Grid>
  );
};

const ChildrenWidget = (abstractChildren: Record<string, IChild[]>) => {
  return (
    <div>
      <SubHeader title="Children" />

      {Object.entries(abstractChildren).map(([parentKey, childrenType]) => (
        <div key={parentKey}>
          {capitaliseFirst(parentKey)}

          {Object.values(childrenType).map((attrType: any) => (
            <PropertyChild
              title={attrType.name}
              onClick={() => {
                findElement(
                  Elements[parentKey as keyof typeof Elements],
                  attrType.name
                );
              }}
              key={attrType.name}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export { ChildrenWidget };
