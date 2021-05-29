import '@testing-library/jest-dom';
import { addChild } from '../backend/addChild/AddChild';
import FileManagement from '../backend/FileManagement';
import { Elements } from '../types/Elements';
import { IChildDetail } from '../types/IChildDetail';
import {
  Component,
  Parser,
  InterfaceType,
  InterfaceTypeString,
} from '../types/ILibcellml';
import { ISearch } from '../types/IQuery';
const libcellModule = require('libcellml.js/libcellml.common');

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

    await addChild(fm, child, parent, parentType);
    component = parser
      .parseModel(fm.getContent())
      .componentByName('root', true);
    console.log(fm.getContent());
    console.log(component.reset(0).testValue());
    expect(component.resetCount()).toEqual(1);
    expect(component.reset(0).order()).toEqual(tOrder);
    expect(component.reset(0).variable().name()).toEqual(tVariable);
    expect(component.reset(0).testVariable().name()).toEqual(tVariableTest);
    expect(component.reset(0).testValue()).toEqual(tTestValue);
    expect(component.reset(0).resetValue()).toEqual(tResetValue);
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
