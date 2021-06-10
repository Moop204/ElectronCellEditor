import React from 'react';
import { Elements, elmToStr } from '../../../types/Elements';
import { SubHeader } from '../../components/SubHeader';
import { AddChildSelect } from './forms/AddChildSelect';
import Grid from '@material-ui/core/Grid';

const AddChild = (childElm: Elements, parent: Elements, parentName: string) => {
  return (
    <AddChildSelect
      childElement={childElm}
      parentElement={parent}
      parentName={parentName}
      key={elmToStr(childElm)}
    />
  );
};

const AddChildrenWidget = (prop: { element: Elements; name: string }) => {
  const { element, name } = prop;
  let children = [];
  switch (element) {
    case Elements.model:
      children = [Elements.component, Elements.units];
      break;
    case Elements.component:
      children = [Elements.reset, Elements.variable, Elements.component];
      break;
    case Elements.units:
      children = [Elements.unit];
      break;
    default:
      return <div></div>;
  }
  console.log(children);
  return (
    <Grid item xs={12}>
      {children.length > 0 && <SubHeader title="Add Children" />}
      {children.map((elm) => {
        return AddChild(elm, element, name);
      })}
    </Grid>
  );
};

export { AddChildrenWidget };
