import Grid from '@material-ui/core/Grid';
import React from 'react';
import { SubHeader } from '../../components/SubHeader';
import PropertyAttribute from './PropertyAttribute';

interface IAttributeWidget {
  handleChange: (attrType: string, attrVal: string) => void;
  attribute: Record<string, string>;
}

const AttributeWidget = (prop: IAttributeWidget) => {
  const { handleChange, attribute } = prop;
  return (
    <Grid item xs={12}>
      <SubHeader title="Attributes" />
      {Object.entries(attribute).map(([attrTitle, attrVal]) => (
        <PropertyAttribute
          title={attrTitle}
          value={attrVal}
          key={attrTitle}
          onChange={(e) => handleChange(attrTitle, e.target.value)}
        />
      ))}
    </Grid>
  );
};

export { AttributeWidget };
