import React from 'react';
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
import { elmToStr } from '../../../types/Elements';
import { ipcRenderer } from 'electron';

const Basic = (prop) => {
  const { attr, parent, child, parentName } = prop;
  const validationSchema = yup.object({
    name: yup
      .string('Name')
      .min(1, 'Require at least one character')
      .matches(
        /^[a-zA-Z][a-z-A-Z0-9_]*$/,
        'Must start with an alphabetical character'
      )
      .required('Attribute "name" is required'),
  });

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
        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles();
  const [name, setName] = React.useState('');
  // Controls it popping or not
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
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
          <Basic attr="Name" parent child={elm} parentName />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { AddChildSelect, Basic };
