import React from 'react';
import { Heading } from '../Heading';
import { Help } from './Help';

const ModelHelp = () => {
  const exampleCode = `
  <model name="model_name" >
    <component name="first_component" />
    <units name="first_units" />
    ...
  </model>
  `;
  return (
    <Help pageRef={14}>
      <Heading title={'About CellML Model'} />
      <br />
      In CellML it is the outermost tag for every CellML file. Describes a
      mathematical model. <br />
      <b>Example</b>
      <pre>
        <code>{exampleCode}</code>
      </pre>
      <b>Attributes</b>
      <br />
      <i>Name*</i> - Identifier for the model
      <br />
      <br />
      <b>Children</b>
      <br />
      <i>Units</i> - Units of measurement composed of basic Unit elements used
      in the model.
      <br />
      <i>Component</i> - A component that is on the highest level of the model.
      <br />
    </Help>
  );
};

export { ModelHelp };
