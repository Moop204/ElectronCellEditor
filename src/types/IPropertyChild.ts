import { MouseEventHandler } from 'react';
import { Elements } from './Elements';

interface IPropertyChild {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  element: string;
}

export default IPropertyChild;
