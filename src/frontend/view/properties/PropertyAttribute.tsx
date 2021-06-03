import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import IPropertyAttribute from '../../../types/IPropertyAttribute';

const PropertyAttribute = (props: IPropertyAttribute) => {
  const { title, value, onChange } = props;
  // if (title === 'math') {
  //   return (
  //     <Grid container item direction="row">
  //       <InputLabel>{title}</InputLabel>
  //       <Math mathml={value} />
  //     </Grid>
  //   );
  // }
  return (
    <Grid container item direction="row">
      <InputLabel>{title}</InputLabel>
      <TextField value={value} onChange={onChange} />
    </Grid>
  );
};

export default PropertyAttribute;
