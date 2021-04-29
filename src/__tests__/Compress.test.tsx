import '@testing-library/jest-dom';
import { compressCellml } from '../compression/compress';

describe('Compressing XML', () => {
  test('should remove encapsulated components and replace with the components referenced', () => {
    const validFile = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" name="replace_components" id="replace_components">
  <component name="root"/>
  <component name="L1_c1"/>
  <component name="L1_L2_c1"/>
  <component name="L1_c2"/>
  <encapsulation>
    <component_ref component="root">
      <component_ref component="L1_c1">
        <component_ref component="L1_L2_c1"/>
      </component_ref>
      <component_ref component="L1_c2"/>
    </component_ref>
  </encapsulation>
</model>
`;

    const result = compressCellml(validFile);

    const expectedResult = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" name="replace_components" id="replace_components">
    <component name="root">
        <component name="L1_c1">
            <component name="L1_L2_c1"/>
        </component>
        <component name="L1_c2"/>
    </component>
</model>
`;

    expect(result).toBe(expectedResult);
  });
  test('should display content of imported elements', () => {
    test('of imported component', () => {
      const validFile = `<?xml version="1.0" encoding="UTF-8"?>
        <model xmlns="http://www.cellml.org/cellml/2.0#" name="MembraneModel">
        <import xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../example/SodiumChannelModel.cellml">
            <component component_ref="sodiumChannel" name="sodiumChannel"/>
        </import>
    </model>
    `;
      const result = compressCellml(validFile);
      const expectedResult = `<?xml version="1.0" encoding="UTF-8"?><model xmlns="http://www.cellml.org/cellml/2.0#" name="MembraneModel"><imported-component component_ref="sodiumChannel" name="sodiumChannel" xlink:href="../example/SodiumChannelModel.cellml"/></model>`;
      expect(result).toBe(expectedResult);
    });
    test('of multiple imported component', () => {
      const validFile = `<?xml version="1.0" encoding="UTF-8"?>
          <model xmlns="http://www.cellml.org/cellml/2.0#" name="MembraneModel">
          <import xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../example/SodiumChannelModel.cellml">
            <component component_ref="importedComponent1" name="importedComponent1"/>
            <component component_ref="importedComponent2" name="importedComponent2"/>
          </import>
      </model>
      `;
      const result = compressCellml(validFile);
      const expectedResult = `<?xml version="1.0" encoding="UTF-8"?><model xmlns="http://www.cellml.org/cellml/2.0#" name="MembraneModel"><imported-component component_ref="sodiumChannel" name="sodiumChannel" xlink:href="../example/SodiumChannelModel.cellml"/></model>`;
      expect(result).toBe(expectedResult);
    });
    test('of imported units', () => {
      const validFile = `<?xml version="1.0" encoding="UTF-8"?>
          <model xmlns="http://www.cellml.org/cellml/2.0#" name="importedUnits">
          <import xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../example/SodiumChannelModel.cellml">
              <units units_ref="iUnits" name="iUnits"/>
          </import>
      </model>
      `;
      const result = compressCellml(validFile);
      const expectedResult = `<?xml version="1.0" encoding="UTF-8"?><model xmlns="http://www.cellml.org/cellml/2.0#" name="MembraneModel"><imported-component component_ref="sodiumChannel" name="sodiumChannel" xlink:href="../example/SodiumChannelModel.cellml"/></model>`;
      expect(result).toBe(expectedResult);
    });
    test('of multiple imported units', () => {
      const validFile = `<?xml version="1.0" encoding="UTF-8"?>
          <model xmlns="http://www.cellml.org/cellml/2.0#" name="multipleImportedUnit">
          <import xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../example/SodiumChannelModel.cellml">
            <units units_ref="iUnits1" name="iUnits1"/>
            <units units_ref="iUnits2" name="iUnits2"/>
          </import>
      </model>
      `;
      const result = compressCellml(validFile);
      const expectedResult = `<?xml version="1.0" encoding="UTF-8"?><model xmlns="http://www.cellml.org/cellml/2.0#" name="MembraneModel"><imported-component component_ref="sodiumChannel" name="sodiumChannel" xlink:href="../example/SodiumChannelModel.cellml"/></model>`;
      expect(result).toBe(expectedResult);
    });
  });
  test('should turn math elements into attributes of its parent element', () => {
    test('where parent element is component', () => {
      const validFile = `<?xml version="1.0" encoding="UTF-8"?><model xmlns="http://www.cellml.org/cellml/2.0#" xmlns:cellml="http://www.cellml.org/cellml/2.0#" xmlns:xlink="http://www.w3.org/1999/xlink" name="deriv_approx_sin" id="deriv_approx_sin">
    <component name="sin" id="sin">
        <variable id="x" name="x" interface="public_and_private"/>
        <variable id="sin" name="sin" initial_value="sin_initial_value" interface="public_and_private"/>
        <variable name="sin_initial_value" interface="public_and_private"/>
        <math xmlns="http://www.w3.org/1998/Math/MathML">
            <apply><eq/>
                <apply>
                    <diff/>
                    <bvar>
                        <ci>x</ci>
                    </bvar>
                    <ci>sin</ci>
                </apply>
                <apply><cos/>
                    <ci>x</ci>
                </apply>
            </apply>
        </math>
    </component>
</model>`;
      const result = compressCellml(validFile);

      const expectedResult = `<?xml version="1.0" encoding="UTF-8"?><model xmlns="http://www.cellml.org/cellml/2.0#" xmlns:cellml="http://www.cellml.org/cellml/2.0#" xmlns:xlink="http://www.w3.org/1999/xlink" name="deriv_approx_sin" id="deriv_approx_sin"><component name="sin" id="sin" math="<apply><eq/><apply><diff/><bvar><ci>x</ci></bvar><ci>sin</ci></apply><apply><cos/><ci>x</ci></apply></apply>"><variable id="x" name="x" interface="public_and_private"/><variable id="sin" name="sin" initial_value="sin_initial_value" interface="public_and_private"/><variable name="sin_initial_value" interface="public_and_private"/></component></model>`;
      expect(result).toBe(expectedResult);
    });
    test('where parent component is reset_value or test_value', () => {
      const validFile = `<?xml version="1.0" encoding="UTF-8"?><model xmlns="http://www.cellml.org/cellml/2.0#" xmlns:cellml="http://www.cellml.org/cellml/2.0#" xmlns:xlink="http://www.w3.org/1999/xlink" name="deriv_approx_sin" id="deriv_approx_sin">
<component name="comp" id="comp">
    <reset variable="x" test_variable="x" order="1"> 
        <reset_value>
            <math xmlns="http://www.w3.org/1998/Math/MathML">
                <apply><eq/>
                    <apply>
                        <diff/>
                        <bvar>
                            <ci>x</ci>
                        </bvar>
                        <ci>sin</ci>
                    </apply>
                    <apply><cos/>
                        <ci>x</ci>
                    </apply>
                </apply>
            </math>
        </reset_value>
        <test_value>
            <math xmlns="http://www.w3.org/1998/Math/MathML">
                <apply><eq/>
                    <apply>
                        <diff/>
                        <bvar>
                            <ci>x</ci>
                        </bvar>
                        <ci>sin</ci>
                    </apply>
                    <apply><cos/>
                        <ci>x</ci>
                    </apply>
                </apply>
            </math>
        </test_value>
    </reset>
    <variable id="x" name="x" interface="public_and_private"/>    
</component>

</model>`;
      const result = compressCellml(validFile);
      const expectedResult = `<?xml version="1.0" encoding="UTF-8"?><model xmlns="http://www.cellml.org/cellml/2.0#" xmlns:cellml="http://www.cellml.org/cellml/2.0#" xmlns:xlink="http://www.w3.org/1999/xlink" name="deriv_approx_sin" id="deriv_approx_sin"><component name="comp" id="comp" math=""><reset variable="x" test_variable="x" order="1"><reset_value math="<apply><eq/><apply><diff/><bvar><ci>x</ci></bvar><ci>sin</ci></apply><apply><cos/><ci>x</ci></apply></apply>"/><test_value math="<apply><eq/><apply><diff/><bvar><ci>x</ci></bvar><ci>sin</ci></apply><apply><cos/><ci>x</ci></apply></apply>"/></reset><variable id="x" name="x" interface="public_and_private"/></component></model>`;
      expect(result).toBe(expectedResult);
    });
  });
});