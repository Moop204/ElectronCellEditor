import { Paper, Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { HelpPopup } from "./HelpPopup";

const ComponentHelp: FunctionComponent = () => {
  const exampleCode = `
  <component name="main_component">
    <variable name="inner_variable" />
    <math xmlns="http://www.w3.org/1998/Math/MathML">
      ...
    </math>
    ...
  </component>
  `;
  return (
    <HelpPopup pageRef={14} title="About CellML Component">
      <br />
      <Typography variant="body1">
        Corresponds to a physical compartment, event, or species, or it may be
        just a convenient modelling abstraction. <br /> <br />
        <b>Example</b>
        <Paper>
          <pre>
            <code>{exampleCode}</code>
          </pre>
        </Paper>
        <b>Attributes</b>
        <br />
        <i>Name*</i> - Identifier for the component.
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
        <i>Reset</i> - Describes a mathematical operation on variables triggered
        by the values of variables.
      </Typography>
    </HelpPopup>
  );
};

export { ComponentHelp };
