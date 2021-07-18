import { Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { HelpPopup } from "./HelpPopup";

const MathHelp: FunctionComponent = () => {
  const exampleCode = `
  <math xmlns="http://www.w3.org/1998/Math/MathML"/>
    <apply><eq/>
      <ci>x</ci>
      <cn cellml:units="seconds">2</cn>
    </apply>
  </math>
  `;
  return (
    <HelpPopup pageRef={8} title="About CellML Model">
      <br />
      MathML is a method of describing a formula using a XML-like structure. The
      outermost tag is ’math’. Each operand inside is defined as a constant, a
      variable or a group of both. Constants require the 'cn' tag and the
      attribute 'cellml:units' to describe their unit type. Variables are
      referenced with 'ci' tags. Groups of either are children of an 'apply'
      tag. To apply operators an ’apply’ tag is used before the operator tag.
      <br />
      <b>Example</b>
      <pre>
        <code>{exampleCode}</code>
      </pre>
      <br />
      <br />
      Operators include:
      <br />
    </HelpPopup>
  );
};

export { MathHelp };
