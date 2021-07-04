import { Paper, Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { HelpPopup } from "./HelpPopup";

const UnitHelp: FunctionComponent = () => {
  const exampleCode = `<unit  
  exponent="2" 
  units="metre"/>`;

  return (
    <HelpPopup pageRef={13} title="About CellML Unit">
      <br />
      <Typography variant="body1">
        A representation of a single physical unit.
        <br /> <br />
        <b>Example</b>A Unit element representing square metre.
        <Paper>
          <pre>
            <code>{exampleCode}</code>
          </pre>
        </Paper>
        <b>Attributes</b>
        <br />
        <i>Prefix</i> - Term placed before the unit itself to denote size of
        unit.
        <br />
        <i>Exponent</i> - Power of the unit.
        <br />
        <i>Multiplier</i> - Number by which the value is multiplied.
        <br />
        <i>Units</i> - May be a standard unit such as second, metres or litres,
        or another defined Units element. Reflects a physical unit used to
        measure a variable.
      </Typography>
    </HelpPopup>
  );
};

export { UnitHelp };
