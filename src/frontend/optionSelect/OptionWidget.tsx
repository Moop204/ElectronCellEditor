/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Heading } from '../components/Heading';
import { TextViewButton } from './TextViewButton';
import { SpatialViewButton } from './SpatialViewButton';
import { VisibilityButton } from './VisibilityButton';
import { UndoButton } from './UndoButton';
import { RedoButton } from './RedoButton';

const OptionWidget = ({ valid }: { valid: boolean }) => {
  return (
    <Grid container item>
      <Heading title="Views" />
      <Grid container item>
        <Grid item md={3}>
          <TextViewButton />
        </Grid>
        <Grid item md={3}>
          <SpatialViewButton />
        </Grid>
        <Grid item md={2}>
          <VisibilityButton />
        </Grid>
        <Grid item md={2}>
          <UndoButton />
        </Grid>
        <Grid item md={2}>
          <RedoButton />
        </Grid>
      </Grid>
    </Grid>
  );
};

export { OptionWidget };
