import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Heading } from './Heading';

const NewChild = (props) => {
  return <Paper> W.I.P</Paper>;
};

const AddChildren = (props) => {
  let val = 1;
  return (
    <Grid container item>
      <Heading title="Add Children" />
      <Grid item md={12}>
        {Array(5)
          .fill(0)
          .map((issue) => {
            const key = 'attr' + val;
            val++;
            return <NewChild key={key} />;
          })}
      </Grid>
    </Grid>
  );
};

export { AddChildren, NewChild };
