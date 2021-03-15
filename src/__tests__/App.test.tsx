import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../App';
import libcellModule from '../wasm/libcellml';
import { importFile } from '../AsyncMain';

// describe('App', () => {
//   it('should render', () => {
//     expect(render(<App />)).toBeTruthy();
//   });
// });

describe('CellML Library', () => {
  test('should read valid CellML files and not find any errors', async () => {
    const validFile: string = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" name="complex_encapsulation_example" id="complex_encpsulation_example_id">
  <component name="root"/>
  <component name="L1_c1"/>
  <component name="L1_L2_c1"/>
  <component name="L1_c2"/>
  <component name="L1_c3"/>
  <encapsulation>
    <component_ref component="root">
      <component_ref component="L1_c1">
        <component_ref component="L1_L2_c1"/>
      </component_ref>
      <component_ref component="L1_c2"/>
      <component_ref component="L1_c3"/>
    </component_ref>
  </encapsulation>
</model>
`;
    const libcellml = await libcellModule();
    const parser = new libcellml.Parser();
    const printer = new libcellml.Printer();
    const validator = new libcellml.Validator();
    const { model, errors } = importFile(
      'src/example/complex_encapsulation.xml',
      parser,
      validator
    );
    expect(printer.printModel(model)).toBe(validFile);
    expect(errors.length).toBe(0);
  });
  test('should read invalid CellML files and identify errors', async () => {
    const invalidFile: string = `<xml>
tis not an xml file <much> it pretends to <be>`;
    const libcellml = await libcellModule();
    const parser = new libcellml.Parser();
    const printer = new libcellml.Printer();
    const validator = new libcellml.Validator();
    const { model, errors } = importFile('src/example/bad.xml', parser, validator);
    expect(printer.printModel(model)).toBe(invalidFile);
    expect(errors.length).toBeGreaterThan(0);
  });

  // Figure out how errors work
  describe('Identifying errors', () => {
    test('should detect single errors', () => {
      return false;
    });
    test('should detect multiple errors', () => {
      test('should detect multiple erros on the same line', () => {
        return false;
      });
      test('should detect multiple erros on different lines', () => {
        return false;
      });
    });
  });
});
