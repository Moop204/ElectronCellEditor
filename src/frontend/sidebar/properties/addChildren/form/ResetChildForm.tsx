import React, { FunctionComponent } from "react";
import { useFormik } from "formik";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import * as yup from "yup";
import { Elements, elmToStr } from "../../../../../types/Elements";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";

const validation = (validVariables: string[]) =>
  yup.object({
    reset_variable: yup
      .string()
      .required()
      .oneOf(validVariables, "Must be a valid variable reference."),
    test_variable: yup
      .string()
      .required()
      .oneOf(validVariables, "Must be a valid variable reference."),
    order: yup.number().required(),
    reset_value: yup.string().required(),
    test_value: yup.string().required(),
  });

interface IPopup {
  parent: Elements;
  parentName: string;
  handleClose: () => void;
}

const ResetChildForm: FunctionComponent<IPopup> = ({
  parent,
  parentName,
  handleClose,
}) => {
  let validVariable: string[] = [];
  validVariable = window.api.sendSync("all-variable");
  const validationSchema = validation(validVariable);

  const formik = useFormik({
    initialValues: {
      reset_variable: "",
      test_variable: "",
      order: 1,
      reset_value: "",
      test_value: "",
    },
    validationSchema,
    onSubmit: (values) => {
      window.api.send("add-child", {
        child: {
          type: Elements.reset,
          attribute: {
            reset_variable: values.reset_variable,
            test_variable: values.test_variable,
            order: values.order,
            reset_value: values.reset_value,
            test_value: values.test_value,
          },
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
          id="order"
          name="order"
          label="Order"
          type="number"
          value={formik.values.order}
          onChange={formik.handleChange}
          error={formik.touched.order && Boolean(formik.errors.order)}
          helperText={formik.touched.order && formik.errors.order}
        />

        <Grid container>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel
                id="reset_variable"
                error={Boolean(formik.errors.reset_variable)}
              >
                Variable
              </InputLabel>
              <Select
                labelId="reset_variable"
                id="reset_variable"
                name="reset_variable"
                value={formik.values.reset_variable}
                onChange={formik.handleChange}
                label="Variable"
                input={<Input />}
                error={
                  formik.touched.reset_variable &&
                  Boolean(formik.errors.reset_variable)
                }
              >
                {validVariable.map((v: string) => {
                  return (
                    <MenuItem key={v} value={v}>
                      {v}
                    </MenuItem>
                  );
                })}
                {validVariable.length === 0 && (
                  <MenuItem> No Variable Available </MenuItem>
                )}
              </Select>
              <FormHelperText error>
                {formik.touched.reset_variable && formik.errors.reset_variable}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel
                id="test_variable"
                error={Boolean(formik.errors.test_variable)}
              >
                Test Variable
              </InputLabel>
              <Select
                labelId="test_variable"
                id="test_variable"
                name="test_variable"
                value={formik.values.test_variable}
                onChange={formik.handleChange}
                label="Test Variable"
                input={<Input />}
                error={
                  formik.touched.test_variable &&
                  Boolean(formik.errors.test_variable)
                }
              >
                {validVariable.map((v: string) => {
                  return (
                    <MenuItem key={v} value={v}>
                      {v}
                    </MenuItem>
                  );
                })}
                {validVariable.length === 0 && (
                  <div> No Variable Available </div>
                )}
              </Select>
              <FormHelperText error>
                {formik.touched.test_variable && formik.errors.test_variable}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        <TextField
          fullWidth
          id="reset_value"
          name="reset_value"
          label="reset_value"
          value={formik.values.reset_value}
          multiline
          rows={4}
          onChange={formik.handleChange}
          error={
            formik.touched.reset_value && Boolean(formik.errors.reset_value)
          }
          helperText={formik.touched.reset_value && formik.errors.reset_value}
        />
        <TextField
          fullWidth
          id="test_value"
          name="test_value"
          label="test_value"
          value={formik.values.test_value}
          multiline
          rows={4}
          onChange={formik.handleChange}
          error={formik.touched.test_value && Boolean(formik.errors.test_value)}
          helperText={formik.touched.test_value && formik.errors.test_value}
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
            onClick={() => {
              if (
                !(
                  Boolean(formik.errors.order) ||
                  Boolean(formik.errors.reset_value) ||
                  Boolean(formik.errors.test_value) ||
                  Boolean(formik.errors.test_variable) ||
                  Boolean(formik.errors.reset_variable)
                ) &&
                formik.values.order
              ) {
                console.log(">>> <<<<");
                return handleClose();
              }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

export { ResetChildForm };
