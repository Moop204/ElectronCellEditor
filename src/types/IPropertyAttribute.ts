import { ChangeEventHandler } from 'react';

interface IPropertyAttribute {
  title: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  // updateAttribute: any;
}

export default IPropertyAttribute;
