import React from 'react';
import { useState } from 'react';
import IPropertyAttribute from '../../../types/IPropertyAttribute';
import PropertyAttribute from '../../view/properties/PropertyAttribute';
import { PresentationMath } from './Math';

interface IMathWidget {
  mathml: string;
}

const MathWidget = ({ title, value, onChange }: IPropertyAttribute) => {
  const [clickedOn, setClickedOn] = useState(false);

  return (
    <div>
      {clickedOn && (
        <PropertyAttribute
          title={title}
          value={value}
          key={title}
          onChange={(e) => onChange(title, e.target.value)}
        />
      )}
      {!clickedOn && <PresentationMath mathml={value} />}
    </div>
  );
};

export { MathWidget };
