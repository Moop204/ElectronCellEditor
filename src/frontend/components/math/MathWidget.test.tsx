import { render, screen } from '@testing-library/react';
import React from 'react';
import { MathWidget } from './MathWidget';

test('renders learn react link', () => {
  const title = 'math';
  const value = `<apply><eq/>
  <apply><diff/>
    <bvar><ci>x</ci></bvar>
    <ci>sin</ci>
  </apply>
  <apply><cos/>
    <ci>x</ci>
  </apply>
</apply>`;
  const dummyOnChange = (title: string, value: any) => {};
  const expectedRender = `<math  xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mi  mathvariant="normal">d</mi><mi>sin</mi></mrow><mrow><mi  mathvariant="normal">d</mi><mi>x</mi></mrow></mfrac><mo>=</mo><mi  mathvariant="normal">cos</mi><mfenced><mi>x</mi></mfenced></math>`;
  render(<MathWidget title={title} value={value} onChange={dummyOnChange} />);
  screen.debug();
});
