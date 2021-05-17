import React from 'react';
import { Elements } from '../../../types/Elements';
import { AddChildSelect, Basic } from '../forms/ComponentChildForm';

const AddChildrenWidget = (prop: { element: Elements; name: string }) => {
  const { element, name } = prop;
  const addChild = (childElm: Elements, parent: Elements) => {
    return (
      <div key={name}>
        <AddChildSelect elm={childElm} parent={element} />
      </div>
    );
  };
  let children = [];
  switch (element) {
    case Elements.model:
      children = [Elements.component, Elements.units];
      break;
    case Elements.component:
      children = [Elements.reset, Elements.variable, Elements.component];
      break;
    default:
      return <div>No Children</div>;
  }
  console.log(children);
  return (
    <div>
      {children.map((elm) => {
        return addChild(elm, element);
      })}
    </div>
  );
};

export default AddChildrenWidget;
