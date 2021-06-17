import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { useState, ChangeEventHandler } from 'react';
import { Elements, elmToStr } from '../../../../types/Elements';
import { ElementHelp } from '../../../components/helper/ElementHelp';
import { ComponentForm } from '../ElementForm';

interface IAddChild {
  childElement: Elements;
  parentElement: Elements;
  parentName: string;
}

const localStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

// Describes children that user can choose to add
const AddChildSelect = (prop: IAddChild) => {
  const { childElement, parentElement, parentName } = prop;
  console.log(`ComponentChildForm elementcheck: ${parentElement}`);

  return (
    <Grid container item direction="row">
      <Grid item xs={10}>
        <ComponentForm
          childElement={childElement}
          parentElement={parentElement}
          parentName={parentName}
        />
      </Grid>
      <Grid item xs={2}>
        <ElementHelp type={childElement} />
      </Grid>
    </Grid>
  );
};

export { AddChildSelect };
