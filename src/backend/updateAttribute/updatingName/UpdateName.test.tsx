import '@testing-library/jest-dom';
import { Elements } from '../../../types/Elements';
import { ICurrentElement } from '../../../types/ICurrentElement';
import {
  Component,
  Model,
  Parser,
  Printer,
  Variable,
} from '../../../types/ILibcellml';
import { ISearch } from '../../../types/IQuery';
import updateName from './UpdateName';
const libcellModule = require('libcellml.js/libcellml.common');

describe('Updating name attributes', () => {
  test('for component', async () => {
    const cellml = await libcellModule();
    const parser: Parser = new cellml.Parser();

    const newName = 'newName';
    const originalName = 'root';

    // Simple model
    const simpleModel = `<?xml version="1.0" encoding="UTF-8"?>
    <model xmlns="http://www.cellml.org/cellml/2.0#" 
      xmlns:cellml="http://www.cellml.org/cellml/2.0#" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      name="model_test" 
      id="complex_encpsulation_example_id">
      <component name="${originalName}"/>    
      </model>  `;

    // Generate simple model
    const m = parser.parseModel(simpleModel);
    const p: Printer = new cellml.Printer();
    const { newModel, newCurrentElement } = updateName(
      m,
      Elements.component,
      { name: originalName, index: null },
      { name: 'model_test', index: null },
      newName,
      m.componentByName(originalName, false)
    );
    expect(newModel.componentCount()).toEqual(1);
    expect(newModel.containsComponentByName(newName, false)).toBeTruthy();
    expect(newModel.containsComponentByName(originalName, false)).toBeFalsy();
    expect((newCurrentElement as Component).name()).toEqual(newName);
  });
  test('for nested component', async () => {
    const cellml = await libcellModule();
    const parser: Parser = new cellml.Parser();

    const newName = 'newName';
    const originalName = 'L1_L2_c1';

    // Simple model
    const simpleModel = `<?xml version="1.0" encoding="UTF-8"?>
    <model xmlns="http://www.cellml.org/cellml/2.0#" 
      xmlns:cellml="http://www.cellml.org/cellml/2.0#" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      name="model_test" 
      id="complex_encpsulation_example_id">
      <component name="root"/>
      <component name="L1_c1"/>
      <component name="L1_c2"/>
      <component name="L1_c3"/>
      <component name="${originalName}"/>
      <encapsulation>
        <component_ref component="root">
          <component_ref component="L1_c1">
            <component_ref component="${originalName}"/>
          </component_ref>
          <component_ref component="L1_c2"/>
          <component_ref component="L1_c3"/>
        </component_ref>
      </encapsulation>
          </model>`;

    // Generate simple model
    const m = parser.parseModel(simpleModel);
    const p: Printer = new cellml.Printer();
    const { newModel, newCurrentElement } = updateName(
      m,
      Elements.component,
      { name: originalName, index: null },
      { name: 'L1_c1', index: null },
      newName,
      m.componentByName(originalName, true)
    );
    expect(newModel.componentCount()).toEqual(1);
    expect(newModel.containsComponentByName(newName, true)).toBeTruthy();
    expect(newModel.containsComponentByName(originalName, true)).toBeFalsy();
    expect((newCurrentElement as Component).name()).toEqual(newName);
  });
  test('for model', async () => {
    const cellml = await libcellModule();
    const parser: Parser = new cellml.Parser();

    const newName = 'newName';
    const originalName = 'model_test';

    // Simple model
    const simpleModel = `<?xml version="1.0" encoding="UTF-8"?>
    <model xmlns="http://www.cellml.org/cellml/2.0#" 
      xmlns:cellml="http://www.cellml.org/cellml/2.0#" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      name="${originalName}" 
      id="complex_encpsulation_example_id">
      </model>  `;

    // Generate simple model
    const m = parser.parseModel(simpleModel);
    const p: Printer = new cellml.Printer();
    const { newModel, newCurrentElement } = updateName(
      m,
      Elements.model,
      { name: originalName, index: null },
      { name: '', index: null },
      newName,
      m.clone()
    );
    expect(newModel.name()).toEqual(newName);
    expect((newCurrentElement as Model).name()).toEqual(newName);
  });
  test('for variable', async () => {
    const cellml = await libcellModule();
    const parser: Parser = new cellml.Parser();

    const newName = 'newName';
    const originalName = 'variable_name';

    // Simple model
    const simpleModel = `<?xml version="1.0" encoding="UTF-8"?>
    <model xmlns="http://www.cellml.org/cellml/2.0#" 
      xmlns:cellml="http://www.cellml.org/cellml/2.0#" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      name="model_test" 
      id="complex_encpsulation_example_id">
      <component name="root">
      <variable name="${originalName}" units="ampere"/>
    </component>  
      </model>  `;

    // Generate simple model
    const m = parser.parseModel(simpleModel);
    const p: Printer = new cellml.Printer();
    const { newModel, newCurrentElement } = updateName(
      m,
      Elements.variable,
      { name: originalName, index: null },
      { name: 'root', index: null },
      newName,
      m.clone()
    );
    expect(newModel.componentByName('root', true)).toBeDefined();
    expect(
      newModel.componentByName('root', true).variableByName(newName)
    ).toBeDefined();
    expect((newCurrentElement as Variable).name()).toEqual(newName);
  });

  test('for units', async () => {
    const cellml = await libcellModule();
    const parser: Parser = new cellml.Parser();

    const newName = 'newName';
    const originalName = 'test_unit';

    // Simple model
    const simpleModel = `<?xml version="1.0" encoding="UTF-8"?>
    <model xmlns="http://www.cellml.org/cellml/2.0#" 
      xmlns:cellml="http://www.cellml.org/cellml/2.0#" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      name="model_test" 
      id="complex_encpsulation_example_id">
      <units prefix="1" name="${originalName}"/>
  </model>`;

    // Generate simple model
    const m = parser.parseModel(simpleModel);
    const p: Printer = new cellml.Printer();
    const { newModel, newCurrentElement } = updateName(
      m,
      Elements.units,
      { name: originalName, index: null },
      { name: 'model_test', index: null },
      newName,
      m.unitsByName(originalName)
    );
    expect(newModel.unitsByName(newName)).toBeDefined();
    expect(newModel.unitsByName(originalName)).toBeNull();
  });
});
