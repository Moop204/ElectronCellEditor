import '@testing-library/jest-dom';
import { Elements } from '../../types/Elements';
import { IChildDetail } from '../../types/IChildDetail';
import { Model, Parser, Units } from '../../types/ILibcellml';
import { ISearch } from '../../types/IQuery';
import FileManagement from '../FileManagement';
import { addChild } from './AddChild';

const libcellModule = require('libcellml.js/libcellml.common');

describe('Adding child of type Unit', () => {
  test('with only unit type to Units', async () => {
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
    await addChild(fm, child, parent, parentType);

    // Add unit
    const child1: IChildDetail = {
      type: Elements.unit,
      attribute: {
        prefix: '',
        multiplier: 1,
        exponent: 1,
        units: 'second',
      },
    };

    const parent1: ISearch = {
      name: newName,
      index: null,
    };

    await addChild(fm, child1, parent1, Elements.units);
    const selectedUnits = parser
      .parseModel(fm.getContent())
      .unitsByName(newName);
    // Post Model
    expect(
      parser.parseModel(fm.getContent()).unitsByName(newName)
    ).toBeDefined();
    expect(parser.parseModel(fm.getContent()).unitsCount()).toBe(1);
    expect(selectedUnits.unitCount()).toEqual(1);
    expect(selectedUnits.unitAttributeExponent(0)).toEqual(1);
    expect(selectedUnits.unitAttributeMultiplier(0)).toEqual(1);
    expect(selectedUnits.unitAttributePrefix(0)).toEqual('');
    expect(selectedUnits.unitAttributeReference(0)).toEqual('second');
    // Post Current Element
    expect((fm.getCurrentComponent() as Units).unitCount()).toEqual(1);
  });
});
