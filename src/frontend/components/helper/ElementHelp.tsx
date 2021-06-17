import React, { FunctionComponent } from 'react';
import { Elements } from '../../../types/Elements';
import { ComponentHelp } from './ComponentHelp';
import { ModelHelp } from './ModelHelp';

const ElementHelp = ({ type }: { type: Elements }) => {
  let help = <div />;
  switch (type) {
    case Elements.component:
      help = <ComponentHelp />;
      break;
    case Elements.model:
      help = <ModelHelp />;
      break;
    default:
  }
  return help;
};

export { ElementHelp };
