import { Paper, Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { HelpPopup } from "./HelpPopup";

const VariableHelp: FunctionComponent = () => {
  const exampleCode = `<variable 
  name="time" 
  public_interface="out" 
  units="second"/>`;

  return (
    <HelpPopup pageRef={13} title="About CellML Variable">
      <br />
      <Typography variant="body1">
        A measure of something that can be changed.
        <br /> <br />
        <b>Example</b>
        <Paper>
          <pre>
            <code>{exampleCode}</code>
          </pre>
        </Paper>
        <b>Attributes</b>
        <br />
        <i>Name*</i> - Identifier for the Variable element.
        <br />
        <i>Public Interface</i> - Defines which other variables interact with
        it. Public interfaces allow variables from components that share the
        same parent or encapsulate the component of a variable to reference it.
        Private interfaces only allow variables from encapsulated components to
        be reference this variable. None interfaces prevent the variable from
        being referenced.
        <br />
        <i>Units*</i> - A physical unit used to describe the Variable.
        <br />
        <i>Initial Value</i> - A real number or a reference to another variable
        that is the variable's value at the beginning of simulation.
      </Typography>
    </HelpPopup>
  );
};

export { VariableHelp };
