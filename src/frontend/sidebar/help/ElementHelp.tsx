import React, { FunctionComponent } from "react";
import { Elements } from "../../../types/Elements";
import { ComponentHelp } from "./ComponentHelp";
import { ModelHelp } from "./ModelHelp";
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
    default:
  }
  return help;
};

export { ElementHelp };
