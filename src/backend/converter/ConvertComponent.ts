import { Component } from '../../types/ILibcellml';
import { Elements } from '../../types/Elements';
import { IProperties } from '../../types/IProperties';

const convertComponent = (component: Component) => {
  console.log(component);
  const resetNum = component.resetCount();
  const varNum = component.variableCount();
  const compNum = component.componentCount();

  const listReset = [];
  for (let i = 0; i < resetNum; i += 1) {
    listReset.push(component.reset(i).variable().name());
  }

  const listVar = [];
  for (let i = 0; i < varNum; i += 1) {
    listVar.push(component.variableByIndex(i).name());
  }

  const listComponent = [];
  for (let i = 0; i < compNum; i += 1) {
    listComponent.push(component.componentByIndex(i).name());
  }

  const hasParent: boolean = component.hasParent();

  const propertyFormat: IProperties = {
    type: Elements.component,
    attribute: {
      name: component.name(),
      math: component.math(),
    },
    parent: {
      type: hasParent ? Elements.component : Elements.model,
      // TODO: Temporary fix until libcellml updates parent() binding
      name: hasParent ? '' : '', //(component.parent() as Model | Component).name() : '',
    },
    children: {
      reset: listReset.map((name: string, index: number) => {
        return { name, index };
      }),
      variable: listVar.map((name: string, index: number) => {
        return { name, index };
      }),
      component: listComponent.map((name: string, index: number) => {
        return { name, index };
      }),
    },
  };
  return propertyFormat;
};

export { convertComponent };
