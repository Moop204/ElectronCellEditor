import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import React, { useState, ChangeEventHandler } from 'react';
import { Elements, elmToStr } from '../../../types/Elements';
import { ComponentChildForm } from './forms/form-type/ComponentChildForm';
import { Input } from '@material-ui/core';
import { InputType } from './forms/utility/Inputs';
import { UnitsChildForm } from './forms/form-type/UnitsChildForm';
import { VariableChildForm } from './forms/form-type/VariableChildForm';

interface IAddChild {
  childElement: Elements;
  parentElement: Elements;
  parentName: string;
}

const localStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const ComponentForm = (prop: IAddChild) => {
  const { childElement, parentElement, parentName } = prop;
  const classes = localStyles();
  // Controls it popping or not
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log(`ComponentChildForm elementcheck: ${parentElement}`);

  return (
    <div>
      <Button onClick={handleClickOpen}>+ {elmToStr(childElement)}</Button>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          Add {elmToStr(childElement)} as child of {elmToStr(parentElement)}
        </DialogTitle>
        <DialogContent>
          {childElement === Elements.component && (
            <ComponentChildForm
              parent={parentElement}
              parentName={parentName}
              handleClose={handleClose}
            />
          )}
          {childElement === Elements.units && (
            <UnitsChildForm
              parent={parentElement}
              parentName={parentName}
              handleClose={handleClose}
            />
          )}
          {childElement === Elements.variable && (
            <VariableChildForm
              parent={parentElement}
              parentName={parentName}
              handleClose={handleClose}
            ></VariableChildForm>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { ComponentForm };
