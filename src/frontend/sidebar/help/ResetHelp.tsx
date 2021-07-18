import { Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { HelpPopup } from "./HelpPopup";

const ResetHelp: FunctionComponent = () => {
  const exampleCode = `
  <reset variable="r" test_variable="t" order="1">
  <test_value>
    <math xmlns="http://www.w3.org/1998/Math/MathML">
      ...
    </math>
  </test_value>
  <reset_value>
    <math xmlns="http://www.w3.org/1998/Math/MathML">
      ...
    </math>
  </reset_value>
</reset>
`;
  return (
    <HelpPopup pageRef={16} title="About CellML Model">
      <br />
      The element that describes the change to the Variable specified by the
      'variable' attribute during simulation. These changes are triggered by the
      Variable referred to by the attribute 'test_variable' <br />
      <b>Example</b>
      <pre>
        <code>{exampleCode}</code>
      </pre>
      <b>Attributes</b>
      <br />
      <i>Variable*</i> - The name of a Variable that the change is applied to.
      <br />
      <i>Test Variable*</i> - The name of a Variable whose value triggers the
      change.
      <br />
      <i>Order*</i> - The priority of this Reset element. A higher number means
      the reset will be applied after Resets with lower order.
      <br />
      <br />
      <b>Children</b>
      <br />
      <i>Reset Value*</i> - A MathML expression that defines what the value of
      the 'variable' Variable is upon reset.
      <br />
      <i>Test Value*</i> - When the 'test_variable' Variable has a value
      equivalent to the MathML expression in the Test Value element then it
      triggers the reset.
      <br />
    </HelpPopup>
  );
};

export { ResetHelp };
