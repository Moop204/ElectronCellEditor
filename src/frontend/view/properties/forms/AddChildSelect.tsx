import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { useState, ChangeEventHandler } from 'react';
import { Elements, elmToStr } from '../../../../types/Elements';
import { ComponentForm } from '../ComponentForm';

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

// Describes children that user can choose to add
const AddChildSelect = (prop: IAddChild) => {
  const { childElement, parentElement, parentName } = prop;
  const classes = localStyles();
  const [name, setName] = useState('');
  // Controls it popping or not
  const [open, setOpen] = useState(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    console.log(event.target.value);
    setName(event.target.value || '');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log(`ComponentChildForm elementcheck: ${parentElement}`);

  return (
    <div>
      <ComponentForm
        childElement={childElement}
        parentElement={parentElement}
        parentName={parentName}
      />
    </div>
  );
};

export { AddChildSelect };
