import React, { FunctionComponent } from 'react';
import { useState } from 'react';
import { Heading } from '../Heading';
import { Help } from './Help';

const ComponentHelp = () => {
  const exampleCode = `
  <component name="main_component">
    <component name="inner_component" />
    <variable name="inner_variable" />
    <math xmlns="http://www.w3.org/1998/Math/MathML">
      ...
    </math>
    ...
  </component>
  `;
  return (
    <Help pageRef={14}>
      <Heading title={'About CellML Component'} />
      <br />
      Corresponds to a physical compartment, event, or species, or it may be
      just a convenient modelling abstraction. <br />
      <b>Example</b>
      <pre>
        <code>{exampleCode}</code>
      </pre>
      <b>Attributes</b>
      <br />
      <i>Name*</i> - Identifier for the component
      <br />
      <i>Import Source</i> - Required only when describing an imported
      component. Refers to the location of the CellML file the component is
      located in.
      <br />
      <i>Reference</i> - Required only when describing an imported component.
      Refers to name of the imported component in the source file.
      <br />
      <br />
      <b>Children</b>
      <br />
      <i>Variables</i> - A variable contained within the component.
      <br />
      <i>Component</i> - A component that is encapsulated within this component.
      <br />
      <i>Reset</i> - Describes a mathematical operation on variables triggered
      by the values of variables.
    </Help>
  );
};

export { ComponentHelp };
