import React, { FunctionComponent } from "react";
import { Elements } from "../../../types/Elements";
import { ComponentHelp } from "./ComponentHelp";
import { MathHelp } from "./MathHelp";
import { ModelHelp } from "./ModelHelp";
import { ResetHelp } from "./ResetHelp";
import { UnitHelp } from "./UnitHelp";
import { UnitsHelp } from "./UnitsHelp";
import { VariableHelp } from "./VariableHelp";

interface IElementHelp {
  type: Elements;
}

const ElementHelp: FunctionComponent<IElementHelp> = ({ type }) => {
  let help = <div />;
  switch (type) {
    case Elements.component:
      help = <ComponentHelp />;
      break;
    case Elements.model:
      help = <ModelHelp />;
      break;
    case Elements.units:
      help = <UnitsHelp />;
      break;
    case Elements.variable:
      help = <VariableHelp />;
      break;
    case Elements.unit:
      help = <UnitHelp />;
      break;
    case Elements.reset:
      help = <ResetHelp />;
    case Elements.math:
      help = <MathHelp />;

    default:
  }
  return help;
};

export { ElementHelp };
