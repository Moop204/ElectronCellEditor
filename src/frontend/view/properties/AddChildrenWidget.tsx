import React from 'react';
import { Elements, elmToStr } from '../../../types/Elements';
import { AddChildSelect, Basic } from './forms/ComponentChildForm';

const AddChildrenWidget = (prop: { element: Elements; name: string }) => {
  const { element, name } = prop;
  const addChild = (childElm: Elements, parent: Elements) => {
    return (
      <AddChildSelect
        childElement={childElm}
        parentElement={element}
        parentName={name}
        key={elmToStr(childElm)}
      />
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
      dsfsdfdfsdf
    </div>
  );
};

export { AddChildrenWidget };
