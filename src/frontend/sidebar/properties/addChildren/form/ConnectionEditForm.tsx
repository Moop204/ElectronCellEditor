import React, { FunctionComponent, useState } from "react";
import { useFormik } from "formik";
import DialogActions from "@material-ui/core/DialogActions";
import * as yup from "yup";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";

interface IConnectionEdit {
  index: number;
  handleClose: any;
}

interface IConnectionDescriptor {
  component: string; // Name of the parent component
  variable: string; // Name of the variable
}

const validation = (validVariables: string[], validComponents: string[]) =>
  yup.object({
    variable: yup.string().required().oneOf(validVariables),
    component: yup.string().oneOf(validComponents),
  });

const ConnectionEditForm: FunctionComponent<IConnectionEdit> = ({
  index,
  handleClose,
}) => {
  const validVariables = window.api.sendSync("all-equivalent-variables");
  const validComponents = [
    "any",
    ...window.api.sendSync("all-equivalent-components"),
  ];
  const validationSchema = validation(validVariables, validComponents);

  const formik = useFormik({
    initialValues: {
      variable: null,
      component: "any",
    },
    validationSchema,
    onSubmit: (values) => {
      window.api.send("add-connection", {});
      console.log(values);
    },
  });

  return (
    <Grid container>
      <form onSubmit={formik.handleSubmit} style={{ width: "70vw" }}>
        <Grid container>
          <FormControl fullWidth>
            <InputLabel id="component" error={Boolean(formik.errors.component)}>
              Component
            </InputLabel>
            <Select
              required
              labelId="component"
              id="component"
              name="component"
              value={formik.values.component}
              onChange={formik.handleChange}
              label="component"
              input={<Input />}
              error={
                formik.touched.component && Boolean(formik.errors.component)
              }
            >
              {validComponents.map((v: string) => {
                return (
                  <MenuItem key={v} value={v.toLowerCase()}>
                    {v}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText error>
              {formik.touched.component && formik.errors.component}
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="variable" error={Boolean(formik.errors.variable)}>
              Variable
            </InputLabel>
            <Select
              required
              labelId="variable"
              id="variable"
              name="variable"
              value={formik.values.variable}
              onChange={formik.handleChange}
              label="variable"
              input={<Input />}
              error={formik.touched.variable && Boolean(formik.errors.variable)}
            >
              {validVariables
                .filter((variable: IConnectionDescriptor) => {
                  if (formik.values.component === "any") {
                    return true;
                  } else {
                    return formik.values.component === variable.component;
                  }
                })
                .map((v: IConnectionDescriptor) => {
                  return (
                    <MenuItem
                      key={v.component + v.variable}
                      value={v.variable.toLowerCase()}
                    >
                      {v.variable}
                    </MenuItem>
                  );
                })}
            </Select>
            <FormHelperText error>
              {formik.touched.variable && formik.errors.variable}
            </FormHelperText>
          </FormControl>
        </Grid>
      </form>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          onClick={() => {
            if (
              !(
                Boolean(formik.errors.component) ||
                Boolean(formik.errors.variable)
              )
            ) {
              return handleClose();
            }
          }}
        >
          Apply Change
        </Button>
      </DialogActions>
    </Grid>
  );
};

export { ConnectionEditForm };
