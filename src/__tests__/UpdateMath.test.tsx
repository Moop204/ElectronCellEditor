import '../backend/updateAttribute/updatingName/node_modules/@testing-library/jest-dom';
import { Elements } from '../types/Elements';
import { Component, Model } from '../types/ILibcellml';
import updateMath from '../backend/updateAttribute/UpdateMath';

const libcellModule = require('libcellml.js/libcellml.common');

describe('Updating maths with components', () => {
  test('For a component directly under model', async () => {
    const libcell = await libcellModule();
    const m: Model = new libcell.Model();
    m.setName('model_test');
    const c1: Component = new libcell.Component();
    c1.setName('c1_test');
    m.addComponent(c1);
    const mathVal = 'TEST VALUE';
    const { newModel, currentElement } = updateMath(
      m,
      Elements.component,
      { name: 'c1_test', index: null },
      { name: 'model_test', index: null },
      mathVal,
      c1
    );
    expect(newModel.componentCount()).toEqual(m.componentCount());
    expect(c1.math()).toEqual(mathVal);
    expect((currentElement as Component).math()).toEqual(mathVal);
  });
  test('For a component under another component', async () => {
    const libcell = await libcellModule();
    const m: Model = new libcell.Model();
    m.setName('model_test');
    const c1: Component = new libcell.Component();
    c1.setName('c1_test');
    const c2: Component = new libcell.Component();
    c2.setName('c2_test');
    m.addComponent(c1);
    c1.addComponent(c2);
    const mathVal = 'TEST VALUE';
    const { newModel, currentElement } = updateMath(
      m,
      Elements.component,
      { name: 'c2_test', index: null },
      { name: 'c1_test', index: null },
      mathVal,
      c2
    );

    expect(newModel.componentCount()).toEqual(m.componentCount());
    expect(c2.math()).toEqual(mathVal);
    expect((currentElement as Component).math()).toEqual(mathVal);
  });
});
