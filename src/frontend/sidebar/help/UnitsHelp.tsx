import { Paper, Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { HelpPopup } from "./HelpPopup";

const UnitsHelp: FunctionComponent = () => {
  const exampleCode = `<units name="nM_per_L">
  <unit prefix="nano" units="mole" />
  <unit units="litre" exponent="-1" />
</units>`;

  return (
    <HelpPopup pageRef={12} title="About CellML Units">
      <br />
      <Typography variant="body1">
        A type of measurement. For example kilometres per minute. Can be
        composed of several individual Unit elements.
        <br /> <br />
        <b>Example</b>
        <Paper>
          <pre>
            <code>{exampleCode}</code>
          </pre>
        </Paper>
        <b>Attributes</b>
        <br />
        <i>Name*</i> - Identifier for the Units element.
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
        <i>Unit</i> - A unit type that composes the greater units.
      </Typography>
    </HelpPopup>
  );
};

export { UnitsHelp };
