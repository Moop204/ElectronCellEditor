import '@testing-library/jest-dom';
import { Elements } from '../../types/Elements';
import { Component, Model, Units } from '../../types/ILibcellml';
import { convertSelectedElement } from './Converter';
import { convertUnits } from './ConvertUnits';

const libcellModule = require('libcellml.js/libcellml.common');

describe('Converting CellML Model into property format', () => {
  test('Converting Empty Model', async () => {
    const libcellml = await libcellModule();
    const parser = new libcellml.Parser();
    // Make model
    const sampleModel = `<?xml version="1.0" encoding="UTF-8"?>
    <model xmlns="http://www.cellml.org/cellml/2.0#" name="test"/>
    `;
    const m = parser.parseModel(sampleModel);

    // Give model to converter
    const convertedModel = convertSelectedElement(Elements.model, m);

    // Check attributes of model are preserved
    expect(convertedModel.type).toEqual(Elements.model);
    expect(Object.keys(convertedModel.attribute).length).toEqual(1);
    expect(convertedModel.attribute['name']).toBeDefined();
    // A child for each child-type
    expect(Object.keys(convertedModel.children).length).toEqual(2);
    expect(convertedModel.children['component'].length).toEqual(0);
    expect(convertedModel.children['units'].length).toEqual(0);
    expect(convertedModel.parent.type).toEqual(Elements.none);
  });

  test('Converting a Model with children', async () => {
    const libcellml = await libcellModule();
    const parser = new libcellml.Parser();
    // Make model
    const sampleModel = `<?xml version="1.0" encoding="UTF-8"?>
    <model xmlns="http://www.cellml.org/cellml/2.0#" name="test">
        <component name="test_component"/>
        <units prefix="1" name="test_units"/>
    </model>
    `;
    const m = parser.parseModel(sampleModel);

    // Give model to converter
    const convertedModel = convertSelectedElement(Elements.model, m);
    // Check attributes of model are preserved
    expect(convertedModel.type).toEqual(Elements.model);
    expect(Object.keys(convertedModel.attribute).length).toEqual(1);
    expect(convertedModel.attribute['name']).toEqual('test');
    // A child for each child-type
    expect(Object.keys(convertedModel.children).length).toEqual(2);
    expect(convertedModel.children['component'].length).toEqual(1);
    expect(convertedModel.children['units'].length).toEqual(1);
    expect(convertedModel.parent.type).toEqual(Elements.none);
  });
});

describe('Converting CellML Component into property format', () => {
  test('Converting Basic Component', async () => {
    const libcellml = await libcellModule();
    // Make Component
    const m: Model = new libcellml.Model();
    m.setName('testModel');
    const component: Component = new libcellml.Component();
    component.setName('testComponent1');
    m.addComponent(component);
    // Give model to converter
    const convertedElement = convertSelectedElement(
      Elements.component,
      component
    );

    // Check attributes of element are preserved
    expect(convertedElement.type).toEqual(Elements.component);
    expect(Object.keys(convertedElement.attribute).length).toEqual(2);
    expect(convertedElement.attribute['name']).toBeDefined();
    expect(convertedElement.attribute['name']).toEqual('testComponent1');
    expect(convertedElement.attribute['math']).toEqual('');
    // Check children
    expect(convertedElement.children['component'].length).toEqual(0);
    expect(convertedElement.children['variable'].length).toEqual(0);
    // TODO: Enable test after libcellml parent() binding is fixed
    // expect(convertedElement.parent.type).toEqual(Elements.model);
  });

  //   test('Converting a Component with math', async () => {
  //     const libcellml = await libcellModule();
  //     // Make Component
  //     const m: Model = new libcellml.Model();
  //     m.setName('testModel');
  //     const component: Component = new libcellml.Component();
  //     component.setName('testComponent1');
  //     m.addComponent(component);
  //     // Give model to converter
  //     const convertedElement = convertComponent(component);

  //     // Check attributes of element are preserved
  //     expect(convertedElement.type).toEqual(Elements.component);
  //     expect(Object.keys(convertedElement.attribute).length).toEqual(2);
  //     expect(convertedElement.attribute['name']).toBeDefined();
  //     expect(convertedElement.attribute['name']).toEqual('testComponent1');
  //     expect(convertedElement.attribute['math']).toEqual('');
  //     // Check children
  //     expect(Object.keys(convertedElement.children).length).toEqual(2);
  //     expect(convertedElement.children['component'].length).toEqual(0);
  //     expect(convertedElement.children['variable'].length).toEqual(0);
  //     expect(convertedElement.parent.type).toEqual(Elements.model);
  //   });

  //   test('Converting Component of Component', async () => {
  //     const libcellml = await libcellModule();

  //     // Make Component
  //     const m: Model = new libcellml.Model();
  //     m.setName('testModel');
  //     const componentParent: Component = new libcellml.Component();
  //     componentParent.setName('testComponent1');
  //     m.addComponent(componentParent);
  //     const component: Component = new libcellml.Component();
  //     component.setName('testComponent2');
  //     componentParent.addComponent(component);

  //     // Give model to converter
  //     const convertedElement = convertComponent(component);

  //     // Check attributes of element are preserved
  //     expect(convertedElement.type).toEqual(Elements.component);
  //     expect(Object.keys(convertedElement.attribute).length).toEqual(2);
  //     expect(convertedElement.attribute['name']).toBeDefined();
  //     expect(convertedElement.attribute['name']).toEqual('testComponent2');
  //     expect(convertedElement.attribute['math']).toEqual('');

  //     // Check children
  //     expect(Object.keys(convertedElement.children).length).toEqual(2);
  //     expect(convertedElement.children['component'].length).toEqual(0);
  //     expect(convertedElement.children['variable'].length).toEqual(0);
  //     expect(convertedElement.parent.type).toEqual(Elements.component);
  //   });

  //   // test Converting component with component children

  //   // test Converting component with variable children
  // });

  describe('Converting CellML Units into property format', () => {
    test('Converting barest Units', async () => {
      const libcellml = await libcellModule();
      // Make Component
      const m: Model = new libcellml.Model();
      m.setName('testModel');
      const units: Units = new libcellml.Units();
      units.setName('testUnit1');
      m.addUnits(units);
      // Give model to converter
      const convertedElement = convertSelectedElement(Elements.units, units);

      // Check attributes of element are preserved
      expect(convertedElement.type).toEqual(Elements.units);
      expect(Object.keys(convertedElement.attribute).length).toEqual(2);
      expect(convertedElement.attribute['name']).toBeDefined();
      expect(convertedElement.attribute['name']).toEqual('testUnit1');
      // Check children
      expect(convertedElement.attribute['unit'].length).toEqual(0);
      // TODO: Enable test after libcellml parent() binding is fixed
      // expect(convertedElement.parent.type).toEqual(Elements.model);
    });
    test('Converting Units with Unit', async () => {
      const libcellml = await libcellModule();
      // Make Component
      const m: Model = new libcellml.Model();
      m.setName('testModel');
      const units: Units = new libcellml.Units();
      units.setName('testUnit1');
      units.addUnitByReference('second');
      m.addUnits(units);
      // Give model to converter
      const convertedElement = convertSelectedElement(Elements.units, units);

      // Check attributes of element are preserved
      expect(convertedElement.type).toEqual(Elements.units);
      expect(Object.keys(convertedElement.attribute).length).toEqual(2);
      expect(convertedElement.attribute['name']).toBeDefined();
      expect(convertedElement.attribute['name']).toEqual('testUnit1');
      // Check children
      expect(convertedElement.attribute['unit'].length).toEqual(1);
      expect(
        convertedElement.attribute['unit'][0].description.reference
      ).toEqual('second');
      expect(
        convertedElement.attribute['unit'][0].description.imported
      ).toEqual('');
      expect(convertedElement.attribute['unit'][0].description.prefix).toEqual(
        ''
      );
      expect(
        convertedElement.attribute['unit'][0].description.exponent
      ).toEqual(1);
      expect(
        convertedElement.attribute['unit'][0].description.multiplier
      ).toEqual(1);
      // TODO: Enable test after libcellml parent() binding is fixed
      // expect(convertedElement.parent.type).toEqual(Elements.model);
    });
    test('Converting Units with Unit and exponent, prefixes and multipliers', async () => {
      const libcellml = await libcellModule();
      // Make Component
      const m: Model = new libcellml.Model();
      m.setName('testModel');
      const units: Units = new libcellml.Units();
      units.setName('testUnit1');
      units.addUnitByReferenceStringPrefix('second', 'milli', 1, -1000, '');
      m.addUnits(units);
      // Give model to converter
      const convertedElement = convertSelectedElement(Elements.units, units);

      // Check attributes of element are preserved
      expect(convertedElement.type).toEqual(Elements.units);
      expect(Object.keys(convertedElement.attribute).length).toEqual(2);
      expect(convertedElement.attribute['name']).toBeDefined();
      expect(convertedElement.attribute['name']).toEqual('testUnit1');
      // Check children
      expect(convertedElement.attribute['unit'].length).toEqual(1);
      expect(
        convertedElement.attribute['unit'][0].description.reference
      ).toEqual('second');
      expect(
        convertedElement.attribute['unit'][0].description.imported
      ).toEqual('');
      expect(convertedElement.attribute['unit'][0].description.prefix).toEqual(
        'milli'
      );
      expect(
        convertedElement.attribute['unit'][0].description.exponent
      ).toEqual(1);
      expect(
        convertedElement.attribute['unit'][0].description.multiplier
      ).toEqual(-1000);
      // TODO: Enable test after libcellml parent() binding is fixed
      // expect(convertedElement.parent.type).toEqual(Elements.model);
    });
    test('Converting Units with Unit and exponents', async () => {
      const libcellml = await libcellModule();
      // Make Component
      const m: Model = new libcellml.Model();
      m.setName('testModel');
      const units: Units = new libcellml.Units();
      units.setName('testUnit1');
      units.addUnitByReferenceExponent('second', 12, '');
      m.addUnits(units);
      // Give model to converter
      const convertedElement = convertSelectedElement(Elements.units, units);

      // Check attributes of element are preserved
      expect(convertedElement.type).toEqual(Elements.units);
      expect(Object.keys(convertedElement.attribute).length).toEqual(2);
      expect(convertedElement.attribute['name']).toBeDefined();
      expect(convertedElement.attribute['name']).toEqual('testUnit1');
      // Check children
      expect(convertedElement.attribute['unit'].length).toEqual(1);
      expect(
        convertedElement.attribute['unit'][0].description.reference
      ).toEqual('second');
      expect(
        convertedElement.attribute['unit'][0].description.imported
      ).toEqual('');
      expect(convertedElement.attribute['unit'][0].description.prefix).toEqual(
        ''
      );
      expect(
        convertedElement.attribute['unit'][0].description.exponent
      ).toEqual(12);
      expect(
        convertedElement.attribute['unit'][0].description.multiplier
      ).toEqual(1);
      // TODO: Enable test after libcellml parent() binding is fixed
      // expect(convertedElement.parent.type).toEqual(Elements.model);
    });

    // test('Converting Units with imported Unit', async () => {
    //   const libcellml = await libcellModule();
    //   // Make Component
    //   const m: Model = new libcellml.Model();
    //   m.setName('testModel');
    //   const units: Units = new libcellml.Units();
    //   units.setName('testUnit1');
    //   units.
    //   m.addUnits(units);
    //   // Give model to converter
    //   const convertedElement = convertSelectedElement(Elements.units, units);

    //   // Check attributes of element are preserved
    //   expect(convertedElement.type).toEqual(Elements.units);
    //   expect(Object.keys(convertedElement.attribute).length).toEqual(2);
    //   expect(convertedElement.attribute['name']).toBeDefined();
    //   expect(convertedElement.attribute['name']).toEqual('testUnit1');
    //   // Check children
    //   expect(convertedElement.attribute['unit'].length).toEqual(1);
    //   expect(
    //     convertedElement.attribute['unit'][0].description.reference
    //   ).toEqual('second');
    //   expect(
    //     convertedElement.attribute['unit'][0].description.imported
    //   ).toEqual('');
    //   expect(convertedElement.attribute['unit'][0].description.prefix).toEqual(
    //     ''
    //   );
    //   expect(
    //     convertedElement.attribute['unit'][0].description.exponent
    //   ).toEqual(12);
    //   expect(
    //     convertedElement.attribute['unit'][0].description.multiplier
    //   ).toEqual(1);
    //   // TODO: Enable test after libcellml parent() binding is fixed
    //   // expect(convertedElement.parent.type).toEqual(Elements.model);
    // });

    test('Converting Units with multiple Unit', async () => {
      const libcellml = await libcellModule();
      // Make Component
      const m: Model = new libcellml.Model();
      m.setName('testModel');

      const units: Units = new libcellml.Units();
      units.setName('testUnit1');
      units.addUnitByReferenceExponent('second', 12, '');
      units.addUnitByReferenceStringPrefix('second', 'milli', 1, -1000, '');

      m.addUnits(units);
      // Give model to converter
      const convertedElement = convertSelectedElement(Elements.units, units);

      // Check attributes of element are preserved
      expect(convertedElement.type).toEqual(Elements.units);
      expect(Object.keys(convertedElement.attribute).length).toEqual(2);
      expect(convertedElement.attribute['name']).toBeDefined();
      expect(convertedElement.attribute['name']).toEqual('testUnit1');
      // Check children
      expect(convertedElement.attribute['unit'].length).toEqual(2);
      expect(
        convertedElement.attribute['unit'][0].description.reference
      ).toEqual('second');
      expect(
        convertedElement.attribute['unit'][0].description.imported
      ).toEqual('');
      expect(convertedElement.attribute['unit'][0].description.prefix).toEqual(
        ''
      );
      expect(
        convertedElement.attribute['unit'][0].description.exponent
      ).toEqual(12);
      expect(
        convertedElement.attribute['unit'][0].description.multiplier
      ).toEqual(1);
      expect(
        convertedElement.attribute['unit'][1].description.reference
      ).toEqual('second');
      expect(
        convertedElement.attribute['unit'][1].description.imported
      ).toEqual('');
      expect(convertedElement.attribute['unit'][1].description.prefix).toEqual(
        'milli'
      );
      expect(
        convertedElement.attribute['unit'][1].description.exponent
      ).toEqual(1);
      expect(
        convertedElement.attribute['unit'][1].description.multiplier
      ).toEqual(-1000);

      // TODO: Enable test after libcellml parent() binding is fixed
      // expect(convertedElement.parent.type).toEqual(Elements.model);
    });
  });

  test('short-test', async () => {
    const libcellml = await libcellModule();
    // Make Component
    const units: Units = new libcellml.Units();
    units.setName('testUnit1');
    units.addUnitByReferenceExponent('second', 12, '');
    units.addUnitByReferenceStringPrefix('second', 'milli', 1, -1000, '');
  });
  // describe('Converting CellML Variables into property format', () => {
  //   test('Converting bare Variable', () => {
  //     //Name + Units attributes
  //     return false;
  //   });
});
