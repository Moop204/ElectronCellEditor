import '@testing-library/jest-dom';
import { Elements } from '../../types/Elements';
import { IChildDetail } from '../../types/IChildDetail';
import { InterfaceType, Parser } from '../../types/ILibcellml';
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
    fm.updateContent(sampleModel);

    const newName = 'newOne';
    const child: IChildDetail = {
      type: Elements.component,
      attribute: [
        {
          name: newName,
        },
      ],
    };
    const parent: ISearch = {
      index: null,
      name: 'test',
    };
    const parentType = Elements.model;

    expect(
      parser.parseModel(fm.getContent()).componentByName(newName, true)
    ).toBeNull();
    expect(parser.parseModel(fm.getContent()).componentCount()).toBe(0);
    addChild(fm, child, parent, parentType);
    expect(
      parser.parseModel(fm.getContent()).componentByName(newName, true)
    ).toBeDefined();
    expect(parser.parseModel(fm.getContent()).componentCount()).toBe(1);
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
    fm.updateContent(sampleModel);

    const newName = 'newOne';
    const child: IChildDetail = {
      type: Elements.component,
      attribute: [
        {
          name: newName,
        },
      ],
    };
    const parent: ISearch = {
      index: null,
      name: 'root',
    };
    const parentType = Elements.component;

    expect(
      parser.parseModel(fm.getContent()).componentByName(newName, true)
    ).toBeNull();
    expect(
      parser
        .parseModel(fm.getContent())
        .componentByName('root', true)
        .componentCount()
    ).toBe(0);
    addChild(fm, child, parent, parentType);
    expect(
      parser.parseModel(fm.getContent()).componentByName(newName, true).name()
    ).toEqual(newName);
    expect(parser.parseModel(fm.getContent()).componentCount()).toBe(1);
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
    fm.updateContent(sampleModel);

    const newName = 'newOne';
    const child: IChildDetail = {
      type: Elements.units,
      attribute: [
        {
          name: newName,
        },
      ],
    };
    const parent: ISearch = {
      index: null,
      name: 'test',
    };
    const parentType = Elements.model;

    expect(parser.parseModel(fm.getContent()).unitsByName(newName)).toBeNull();
    expect(parser.parseModel(fm.getContent()).unitsCount()).toBe(0);
    addChild(fm, child, parent, parentType);
    expect(
      parser.parseModel(fm.getContent()).unitsByName(newName)
    ).toBeDefined();
    expect(parser.parseModel(fm.getContent()).unitsCount()).toBe(1);
  });
});
describe('Adding child of type Variable', () => {
  test('to Component', async () => {
    const libcellml = await libcellModule();
    const parser: Parser = new libcellml.Parser();
    // Make model
    const sampleModel = `<?xml version="1.0" encoding="UTF-8"?>
    <model xmlns="http://www.cellml.org/cellml/2.0#" name="test">
    <component name="root"/>
    <units name="unitsTest"/>
    </model>`;
    const fm = new FileManagement();
    await fm.init();
    fm.updateContent(sampleModel);

    const newName = 'newOne';

    const child: IChildDetail = {
      type: Elements.variable,
      attribute: [
        {
          name: newName,
          varInterface: InterfaceType.PUBLIC,
          initialValue: '5',
          units: 'unitsTest',
        },
      ],
    };
    const parent: ISearch = {
      index: null,
      name: 'root',
    };
    const parentType = Elements.component;

    // Get component to check
    let component = parser
      .parseModel(fm.getContent())
      .componentByName('root', true);
    expect(component.variableCount()).toEqual(0);
    addChild(fm, child, parent, parentType);
    component = parser
      .parseModel(fm.getContent())
      .componentByName('root', true);
    expect(component.variableCount()).toEqual(1);
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
      <variable name="variableTest1" />
      <variable name="variableTest2" />
    </component>
    <units name="unitsTest"/>
    </model>`;
    const fm = new FileManagement();
    await fm.init();
    fm.updateContent(sampleModel);

    const tOrder = 1;
    const tVariable = 'variableTest1';
    const tVariableTest = 'variableTest2';
    const tResetValue = '<math>12</math>';
    const tTestValue = '<math>56</math>';

    const child: IChildDetail = {
      type: Elements.reset,
      attribute: [
        {
          variable: tVariable,
          variableTest: tVariableTest,
          order: tOrder,
          resetValue: tResetValue,
          testValue: tTestValue,
        },
      ],
    };
    const parent: ISearch = {
      index: null,
      name: 'root',
    };
    const parentType = Elements.variable;

    // Get component to check
    let component = parser
      .parseModel(fm.getContent())
      .componentByName('root', true);
    expect(component.resetCount()).toEqual(0);

    addChild(fm, child, parent, parentType);
    component = parser
      .parseModel(fm.getContent())
      .componentByName('root', true);
    expect(component.resetCount()).toEqual(1);
    expect(component.reset(0).order()).toEqual(tOrder);
    expect(component.reset(0).variable().name()).toEqual(tVariable);
    expect(component.reset(0).testVariable().name()).toEqual(tVariableTest);
    console.log(fm.getContent());
    expect(component.reset(0).testValue()).toEqual(tTestValue);
    expect(component.reset(0).resetValue()).toEqual(tResetValue);
  });
});
