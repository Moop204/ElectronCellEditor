import React, { useState, useEffect, ChangeEventHandler } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { ModelProperties } from './ModelProperties';

const PropertiesWidget = () => {
  return (
    <Grid container item>
      <ModelProperties />
    </Grid>
  );
};

export { PropertiesWidget };
