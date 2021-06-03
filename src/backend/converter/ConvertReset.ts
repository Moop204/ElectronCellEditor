import { Component } from '../../types/ILibcellml';
import { Elements } from '../../types/Elements';
import { Reset } from '../../types/ILibcellml';
import { IProperties } from '../../types/IProperties';

const convertReset = (element: Reset) => {
  const resetProp: IProperties = {
    type: Elements.reset,
    parent: {
      type: Elements.component,
      name: (element.parent() as Component).name(),
    },
    attribute: {
      variable: element.variable(),
      testVariable: element.testVariable(),
      order: element.order(),
      resetValue: element.resetValue(),
      testValue: element.testValue(),
    },
    children: {},
  };
  return resetProp;
};

export { convertReset };
