import React, { ChangeEvent, ChangeEventHandler, useState } from 'react';
import { Formik, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import * as yup from 'yup';
import { ipcRenderer } from 'electron';
import { Elements, elmToStr } from '../../../types/Elements';

const nameValidation = yup.object({
  name: yup
    .string()
    .min(1, 'Require at least one character')
    .matches(
      /^[a-zA-Z][a-z-A-Z0-9_]*$/,
      'Must start with an alphabetical character'
    )
    .required('Attribute "name" is required'),
});

interface IPopup {
  attr: string;
  parent: Elements;
  child: Elements;
  parentName: string;
  handleClose: () => void;
}

const Basic = ({ attr, parent, child, parentName, handleClose }: IPopup) => {
  const validationSchema = nameValidation;

  const formik = useFormik({
    initialValues: {
      name: 'name',
    },
    validationSchema,
    onSubmit: (values) => {
      ipcRenderer.send('add-child', {
        child: {
          type: child,
          attribute: [values],
        },
        parent: {
          name: parentName,
          index: null,
        },
        parentType: parent,
      });
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            onClick={handleClose}
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

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

const AddChildSelect = (prop) => {
  const { elm, parent, parentName } = prop;
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

  console.log(`ComponentChildForm elementcheck: ${parent}`);

  return (
    <div>
      <Button onClick={handleClickOpen}>+ {elmToStr(elm)}</Button>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          Add {elmToStr(elm)} as child of {elmToStr(parent)}
        </DialogTitle>
        <DialogContent>
          {/* <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="demo-dialog-native">
                {name ? name : 'Name'}
              </InputLabel>
              <TextField value={name} onChange={handleChange} label="Name" />
            </FormControl>
          </form> */}
          <Basic
            attr="Name"
            parent={parent}
            child={elm}
            parentName={parentName}
            handleClose={handleClose}
          />
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" type="submit">
            Ok
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
};

export { AddChildSelect, Basic };
