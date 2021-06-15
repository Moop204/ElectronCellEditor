import '@testing-library/jest-dom';
import { Elements, elmToStr } from '../../types/Elements';
import { IChildDetail } from '../../types/IChildDetail';
import {
  Component,
  InterfaceType,
  InterfaceTypeString,
  Model,
  Parser,
} from '../../types/ILibcellml';
import { ISearch } from '../../types/IQuery';
import FileManagement from '../FileManagement';
import { addChild } from './AddChild';

const libcellModule = require('libcellml.js/libcellml.common');

describe('Adding child of type Component', () => {
  test('to Model', async () => {
    const libcellml = await libcellModule();
    const parser: Parser = new libcellml.Parser();
    // Make model
    const sampleModel = `<?xml version="1.0" encoding="UTF-8"?>
    <model xmlns="http://www.cellml.org/cellml/2.0#" name="test"/>
    `;
    const fm = new FileManagement();
    await fm.init();
    await fm.setContent(sampleModel);

    const newName = 'newOne';
    const child: IChildDetail = {
      type: Elements.component,
      attribute: {
        name: newName,
      },
    };
    const parent: ISearch = {
      index: null,
      name: 'test',
    };
    const parentType = Elements.model;

    // Check Model
    expect(
      parser.parseModel(fm.getContent()).componentByName(newName, true)
    ).toBeNull();
    expect(parser.parseModel(fm.getContent()).componentCount()).toBe(0);
    await addChild(fm, child, parent, parentType);
    expect(
      parser.parseModel(fm.getContent()).componentByName(newName, true)
    ).toBeDefined();
    expect(parser.parseModel(fm.getContent()).componentCount()).toBe(1);
    // Check Current Element
    expect((fm.getCurrentComponent() as Model).componentCount()).toEqual(1);
    expect(
      (fm.getCurrentComponent() as Model).componentByName(newName, false)
    ).toBeDefined();
  });
  test('to Component', async () => {
    const libcellml = await libcellModule();
    const parser: Parser = new libcellml.Parser();
    // Make model
    const sampleModel = `<?xml version="1.0" encoding="UTF-8"?>
    <model xmlns="http://www.cellml.org/cellml/2.0#" name="test">
    <component name="root"/>
    </model>`;
    const m = parser.parseModel(sampleModel);

    const fm = new FileManagement();
    await fm.init();
    await fm.setContent(sampleModel);

    const newName = 'newOne';
    const child: IChildDetail = {
      type: Elements.component,
      attribute: {
        name: newName,
      },
    };
    const parent: ISearch = {
      index: null,
      name: 'root',
    };
    const parentType = Elements.component;
    let checkModel = parser.parseModel(fm.getContent());
    let checkNewComponent = checkModel.componentByName(newName, true);
    const checkParentComponent = checkModel.componentByName('root', true);
    // Pre Model
    expect(checkNewComponent).toBeNull();
    expect(checkParentComponent.componentCount()).toBe(0);
    await addChild(fm, child, parent, parentType);
    console.log(fm.getContent());
    checkModel = parser.parseModel(fm.getContent());
    checkNewComponent = checkModel.componentByName(newName, true);
    // Post Model
    expect(checkNewComponent.name()).toEqual(newName);
    expect(checkModel.componentCount()).toBe(1);
    // Post Current
    expect((fm.getCurrentComponent() as Model).componentCount()).toEqual(1);
    expect(
      (fm.getCurrentComponent() as Model).componentByName(newName, false).name()
    ).toEqual(newName);
  });
});

describe('Adding child of type Units', () => {
  test('to Model', async () => {
    const libcellml = await libcellModule();
    const parser: Parser = new libcellml.Parser();
    // Make model
    const sampleModel = `<?xml version="1.0" encoding="UTF-8"?>
    <model xmlns="http://www.cellml.org/cellml/2.0#" name="test"/>
    `;
    const fm = new FileManagement();
    await fm.init();
    await fm.setContent(sampleModel);

    const newName = 'newOne';
    const child: IChildDetail = {
      type: Elements.units,
      attribute: {
        name: newName,
      },
    };
    const parent: ISearch = {
      index: null,
      name: 'test',
    };
    const parentType = Elements.model;

    // Pre Model
    expect(parser.parseModel(fm.getContent()).unitsByName(newName)).toBeNull();
    expect(parser.parseModel(fm.getContent()).unitsCount()).toBe(0);
    await addChild(fm, child, parent, parentType);
    // Post Model
    expect(
      parser.parseModel(fm.getContent()).unitsByName(newName)
    ).toBeDefined();
    expect(parser.parseModel(fm.getContent()).unitsCount()).toBe(1);
    // Post Current Element
    expect((fm.getCurrentComponent() as Model).unitsCount()).toEqual(1);
    expect(
      (fm.getCurrentComponent() as Model).unitsByName(newName).name()
    ).toEqual(newName);
  });
});

describe('Adding child of type Variable', () => {
  test('to Component', async () => {
    const libcellml = await libcellModule();
    const parser: Parser = new libcellml.Parser();
    // Make model
    // Make model
    const newName = 'newOne';
    const tInterface = InterfaceTypeString.PUBLIC;
    const tInitialValue = '5';
    const tUnits = 'unitsTest';
    const parentNode = 'root';

    const sampleModel = `<?xml version="1.0" encoding="UTF-8"?>
    <model xmlns="http://www.cellml.org/cellml/2.0#" name="test">
    <component name="${parentNode}"/>
    <units name="${tUnits}"/>
    </model>`;
    const fm = new FileManagement();
    await fm.init();
    await fm.setContent(sampleModel);

    // Get component to check
    let component = parser
      .parseModel(fm.getContent())
      .componentByName(parentNode, true);

    fm.setCurrentComponent(component, Elements.component);

    const child: IChildDetail = {
      type: Elements.variable,
      attribute: {
        name: newName,
        varInterface: tInterface,
        initialValue: tInitialValue,
        units: tUnits,
      },
    };
    const parent: ISearch = {
      index: null,
      name: 'root',
    };
    const parentType = Elements.component;

    // Pre Model
    expect(component.variableCount()).toEqual(0);
    await addChild(fm, child, parent, parentType);

    // Post Model
    component = parser
      .parseModel(fm.getContent())
      .componentByName('root', true);
    expect(component.variableCount()).toEqual(1);
    // Post Current Element
    expect(fm.type).toEqual(Elements.component);
    expect((fm.getCurrentComponent() as Component).name()).toEqual('root');
    expect((fm.getCurrentComponent() as Component).variableCount()).toEqual(1);
    expect(
      (fm.getCurrentComponent() as Component).variableByName(newName).name()
    ).toEqual(newName);
    expect(
      (fm.getCurrentComponent() as Component)
        .variableByName(newName)
        .interfaceType()
    ).toEqual(tInterface);
    expect(
      (fm.getCurrentComponent() as Component)
        .variableByName(newName)
        .initialValue()
    ).toEqual(tInitialValue);
    expect(
      (fm.getCurrentComponent() as Component)
        .variableByName(newName)
        .units()
        .name()
    ).toEqual(tUnits);
  });
});

describe('Adding child of type Reset', () => {
  test('to Variable', async () => {
    const libcellml = await libcellModule();
    const parser: Parser = new libcellml.Parser();
    // Make model
    const sampleModel = `<?xml version="1.0" encoding="UTF-8"?>
    <model xmlns="http://www.cellml.org/cellml/2.0#" name="test">
    <component name="root">
      <variable name="variableTest1" units="unitsTest"/>
      <variable name="variableTest2" units="unitsTest"/>
    </component>
    <units name="unitsTest"/>
    </model>`;
    const fm = new FileManagement();
    await fm.init();
    await fm.setContent(sampleModel);

    // Get component to check
    let component = parser
      .parseModel(fm.getContent())
      .componentByName('root', true);
    expect(component.resetCount()).toEqual(0);

    fm.setCurrentComponent(
      component.variableByName('variableTest1'),
      Elements.variable
    );

    const tOrder = 1;
    const tVariable = 'variableTest1';
    const tVariableTest = 'variableTest2';
    const tResetValue = '<math>12</math>';
    const tTestValue = '<math>56</math>';

    const child: IChildDetail = {
      type: Elements.reset,
      attribute: {
        reset_variable: tVariable,
        test_variable: tVariableTest,
        order: tOrder,
        reset_value: tResetValue,
        test_value: tTestValue,
      },
    };
    const parent: ISearch = {
      index: null,
      name: 'root',
    };
    const parentType = Elements.variable;

    await addChild(fm, child, parent, parentType);
    component = parser
      .parseModel(fm.getContent())
      .componentByName('root', true);
    expect(component.resetCount()).toEqual(1);
    expect(component.reset(0).order()).toEqual(tOrder);
    expect(component.reset(0).variable().name()).toEqual(tVariable);
    expect(component.reset(0).testVariable().name()).toEqual(tVariableTest);
    // expect(component.reset(0).testValue()).toEqual(tTestValue);
    // expect(component.reset(0).resetValue()).toEqual(tResetValue);
    // Post Current Element
    expect((fm.getCurrentComponent() as Component).resetCount()).toEqual(1);
    expect((fm.getCurrentComponent() as Component).reset(0).order()).toEqual(
      tOrder
    );
    expect(
      (fm.getCurrentComponent() as Component).reset(0).variable().name()
    ).toEqual(tVariable);
    expect(
      (fm.getCurrentComponent() as Component).reset(0).testVariable().name()
    ).toEqual(tVariableTest);
    expect(
      (fm.getCurrentComponent() as Component).reset(0).testValue()
    ).toEqual(tTestValue);
    expect(
      (fm.getCurrentComponent() as Component).reset(0).resetValue()
    ).toEqual(tResetValue);
  });
});
