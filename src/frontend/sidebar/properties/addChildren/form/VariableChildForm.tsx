import React, { FunctionComponent } from "react";
import { useFormik } from "formik";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import * as yup from "yup";
import { Elements } from "../../../../../types/Elements";
import Button from "@material-ui/core/Button";
import { allStandardUnits } from "../../../../../utility/standardUnitConverter";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { AllInterfaceType } from "../../../../../utility/interfaceConverter";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import { IPopup } from "../IPopup";
import { useSnackbar } from "notistack";
import { FormAction } from "./FormActions";

const validation = (
  curUnits: string[],
  validInterface: string[],
  validVariables: string[]
) =>
  yup.object({
    name: yup
      .string()
      .required('Attribute "name" is required')
      .min(1, "Require at least one character")
      .matches(
        /^[a-zA-Z][a-zA-Z0-9_]*$/,
        "Must start with an alphabetical character"
      ),
    units: yup.string().required().oneOf(curUnits, "Valid units required"),
    interfaceType: yup
      .string()
      .oneOf(validInterface, "Valid interface required"),
    initialValue: yup
      .string()
      .test(
        "Valid initial value input",
        "Requires a real number or a variable reference.",
        (initVal: string | undefined) => {
          if (!initVal) {
            return true;
          }
          if (validVariables.indexOf(initVal) > -1) {
            return true;
          }
          const patt = new RegExp("^[-+]?[0-9]*.?[0-9]+$");
          if (patt.test(initVal)) {
            return true;
          }
          return false;
        }
      ),
  });

const VariableChildForm: FunctionComponent<IPopup> = ({
  parent,
  parentName,
  handleClose,
}) => {
  let validUnits: string[] = window.api.sendSync("all-units");
  validUnits = [...validUnits, ...allStandardUnits()];
  const validInterface = AllInterfaceType();
  const validVariable: string[] = window.api.sendSync("all-variable");
  const validationSchema = validation(
    validUnits,
    validInterface,
    validVariable
  );

  const { enqueueSnackbar } = useSnackbar();
  const notifyAdd = () => {
    enqueueSnackbar(`Successfully added Variable to ${parentName}`, {
      variant: "info",
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      units: "",
      interfaceType: "none",
      initialValue: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (
        !(
          Boolean(formik.errors.units) ||
          Boolean(formik.errors.name) ||
          Boolean(formik.errors.initialValue) ||
          Boolean(formik.errors.interfaceType)
        ) &&
        formik.values.name
      ) {
        window.api.send("add-child", {
          child: {
            type: Elements.variable,
            attribute: values,
          },
          parent: {
            name: parentName,
            index: null,
          },
          parentType: parent,
        });

        notifyAdd();
        handleClose();
      }
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
        <Grid container xs={12}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="units" error={Boolean(formik.errors.units)}>
                Units
              </InputLabel>
              <Select
                labelId="units"
                id="units"
                name="units"
                value={formik.values.units}
                onChange={formik.handleChange}
                label="Units"
                input={<Input />}
                error={formik.touched.units && Boolean(formik.errors.units)}
              >
                {validUnits.map((v: string) => {
                  return (
                    <MenuItem key={v} value={v.toLowerCase()}>
                      {v}
                    </MenuItem>
                  );
                })}
                {validUnits.length === 0 && <div>No units</div>}
              </Select>
              <FormHelperText error>
                {formik.touched.units && formik.errors.units}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="interfaceType">Interface Type</InputLabel>
              <Select
                labelId="interfaceType"
                id="interfaceType"
                name="interfaceType"
                value={formik.values.interfaceType}
                onChange={formik.handleChange}
                label="Interface Type"
                input={<Input />}
              >
                {validInterface.map((v: string) => {
                  return (
                    <MenuItem key={v} value={v.toLowerCase()}>
                      {v}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TextField
          fullWidth
          id="initialValue"
          name="initialValue"
          label="Initial Value"
          value={formik.values.initialValue}
          multiline
          rows={4}
          onChange={formik.handleChange}
          error={
            formik.touched.initialValue && Boolean(formik.errors.initialValue)
          }
          helperText={formik.touched.initialValue && formik.errors.initialValue}
        />
        <FormAction close={handleClose} acceptText="Add" />
      </form>
    </div>
  );
};

export { VariableChildForm };
