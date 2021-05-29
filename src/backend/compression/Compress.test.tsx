import '@testing-library/jest-dom';
import { compressCellml } from './compress';

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
</model>`;

    const result = compressCellml(validFile);

    const expectedResult = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" name="replace_components" id="replace_components">
    <component name="root" math="">
        <component name="L1_c1" math="">
            <component name="L1_L2_c1" math=""/>
        </component>
        <component name="L1_c2" math=""/>
    </component>
</model>`;

    expect(result).toBe(expectedResult);
  });
  test('should display content of imported elements', () => {
    const validFile = `<?xml version="1.0" encoding="UTF-8"?>
          <model xmlns="http://www.cellml.org/cellml/2.0#" name="MembraneModel">
          <import xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../example/SodiumChannelModel.cellml">
              <component component_ref="sodiumChannel" name="sodiumChannel"/>
          </import>
      </model>
      `;
    const result = compressCellml(validFile);
    const expectedResult = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" name="MembraneModel">
    <imported-component component_ref="sodiumChannel" name="sodiumChannel" xlink:href="../example/SodiumChannelModel.cellml" xmlns:xlink="http://www.w3.org/1999/xlink"/>
</model>`;
    expect(result).toBe(expectedResult);
  });
  test('should display content of multiple imported component', () => {
    const validFile = `<?xml version="1.0" encoding="UTF-8"?>
            <model xmlns="http://www.cellml.org/cellml/2.0#" name="MembraneModel">
            <import xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../example/SodiumChannelModel.cellml">
              <component component_ref="importedComponent1" name="importedComponent1"/>
              <component component_ref="importedComponent2" name="importedComponent2"/>
            </import>
        </model>
        `;
    const result = compressCellml(validFile);
    const expectedResult = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" name="MembraneModel">
    <imported-component component_ref="importedComponent1" name="importedComponent1" xlink:href="../example/SodiumChannelModel.cellml" xmlns:xlink="http://www.w3.org/1999/xlink"/>
    <imported-component component_ref="importedComponent2" name="importedComponent2" xlink:href="../example/SodiumChannelModel.cellml" xmlns:xlink="http://www.w3.org/1999/xlink"/>
</model>`;
    expect(result).toBe(expectedResult);
  });
  test('should display content of imported units', () => {
    const validFile = `<?xml version="1.0" encoding="UTF-8"?>
            <model xmlns="http://www.cellml.org/cellml/2.0#" name="importedUnits">
            <import xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../example/SodiumChannelModel.cellml">
                <units units_ref="iUnits" name="iUnits"/>
            </import>
        </model>
        `;
    const result = compressCellml(validFile);
    const expectedResult = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" name="importedUnits">
    <imported-units units_ref="iUnits" name="iUnits" xlink:href="../example/SodiumChannelModel.cellml" xmlns:xlink="http://www.w3.org/1999/xlink"/>
</model>`;
    expect(result).toBe(expectedResult);
  });
  test('should display content of multiple imported units', () => {
    const validFile = `<?xml version="1.0" encoding="UTF-8"?>
            <model xmlns="http://www.cellml.org/cellml/2.0#" name="multipleImportedUnit">
            <import xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../example/SodiumChannelModel.cellml">
              <units units_ref="iUnits1" name="iUnits1"/>
              <units units_ref="iUnits2" name="iUnits2"/>
            </import>
        </model>
        `;
    const result = compressCellml(validFile);
    const expectedResult = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" name="multipleImportedUnit">
    <imported-units units_ref="iUnits1" name="iUnits1" xlink:href="../example/SodiumChannelModel.cellml" xmlns:xlink="http://www.w3.org/1999/xlink"/>
    <imported-units units_ref="iUnits2" name="iUnits2" xlink:href="../example/SodiumChannelModel.cellml" xmlns:xlink="http://www.w3.org/1999/xlink"/>
</model>`;
    expect(result).toBe(expectedResult);
  });
  test('removing connection and map_variable tags', () => {
    const validFile = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" name="replace_components" id="replace_components">
  <component name="root"/>
  <component name="L1_c1">
    <variable initial_value="0" interface="public" name="V" units="millivolt"/>
  </component>
  <component name="L1_L2_c1"/>
  <component name="L1_c2">
    <variable interface="public_and_private" name="V" units="millivolt"/>
  </component>
  <encapsulation>
    <component_ref component="root">
      <component_ref component="L1_c1">
        <component_ref component="L1_L2_c1"/>
      </component_ref>
      <component_ref component="L1_c2"/>
    </component_ref>
  </encapsulation>
  <connection component_1="L1_c1" component_2="L1_c2">
    <map_variables variable_1="V" variable_2="V"/>
  </connection>
</model>`;
    const res = compressCellml(validFile);
    const expected = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" name="replace_components" id="replace_components">
    <component name="root" math="">
        <component name="L1_c1" math="">
            <variable initial_value="0" interface="public" name="V" units="millivolt"/>
            <component name="L1_L2_c1" math=""/>
        </component>
        <component name="L1_c2" math="">
            <variable interface="public_and_private" name="V" units="millivolt"/>
        </component>
    </component>
</model>`;
    expect(res).toEqual(expected);
  });
});
describe('Compressing MathML', () => {
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
        <encapsulation>
          <component_ref component="sin"/>
        </encapsulation>

    </model>`;
    const result = compressCellml(validFile);

    const expectedResult = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" xmlns:cellml="http://www.cellml.org/cellml/2.0#" xmlns:xlink="http://www.w3.org/1999/xlink" name="deriv_approx_sin" id="deriv_approx_sin">
    <component name="sin" id="sin" math="<apply><eq/><apply><diff/><bvar><ci>x</ci></bvar><ci>sin</ci></apply><apply><cos/><ci>x</ci></apply></apply>">
        <variable id="x" name="x" interface="public_and_private"/>
        <variable id="sin" name="sin" initial_value="sin_initial_value" interface="public_and_private"/>
        <variable name="sin_initial_value" interface="public_and_private"/>
    </component>
</model>`;
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
  <encapsulation> 
    <component_ref component="comp" />  
  </encapsulation>
  </model>`;
    const result = compressCellml(validFile);
    const expectedResult = `<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" xmlns:cellml="http://www.cellml.org/cellml/2.0#" xmlns:xlink="http://www.w3.org/1999/xlink" name="deriv_approx_sin" id="deriv_approx_sin">
    <component name="comp" id="comp" math="">
        <reset variable="x" test_variable="x" order="1" reset_value="<apply><eq/><apply><diff/><bvar><ci>x</ci></bvar><ci>sin</ci></apply><apply><cos/><ci>x</ci></apply></apply>" test_value="<apply><eq/><apply><diff/><bvar><ci>x</ci></bvar><ci>sin</ci></apply><apply><cos/><ci>x</ci></apply></apply>"/>
        <variable id="x" name="x" interface="public_and_private"/>
    </component>
</model>`;
    expect(result).toBe(expectedResult);
  });
});
