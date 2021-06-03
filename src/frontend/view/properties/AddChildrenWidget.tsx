import React from 'react';
import { Elements, elmToStr } from '../../../types/Elements';
import { AddChildSelect } from './forms/AddChildSelect';

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
    <div>
      {children.length > 0 &&
        children.map((elm) => {
          return AddChild(elm, element, name);
        })}
    </div>
  );
};

export { AddChildrenWidget };
