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
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import { AllPrefix } from "../../../../../utility/prefixConverter";
import { IPopup } from "../IPopup";
import { useSnackbar } from "notistack";

const validation = (validPrefix: string[], validUnits: string[]) =>
  yup.object({
    prefix: yup.string(),
    multiplier: yup.string(),
    exponent: yup.string(),
    units: yup.string().required().oneOf(validUnits),
  });

const UnitChildForm: FunctionComponent<IPopup> = ({
  parent,
  parentName,
  handleClose,
}) => {
  let validUnits: string[] = allStandardUnits();
  validUnits = [...validUnits, ...window.api.sendSync("all-units")];
  const validPrefix = AllPrefix();
  const validationSchema = validation(validPrefix, validUnits);

  const formik = useFormik({
    initialValues: {
      prefix: "",
      multiplier: "",
      exponent: "",
      units: "",
    },
    validationSchema,
    onSubmit: (values) => {
      window.api.send("add-child", {
        child: {
          type: Elements.unit,
          attribute: values,
        },
        parent: {
          name: parentName,
          index: null,
        },
        parentType: parent,
      });
    },
  });

  const { enqueueSnackbar } = useSnackbar();
  const notifyAdd = () => {
    enqueueSnackbar(`Successfully added Unit to ${parentName}`, {
      variant: "info",
    });
  };

  return (
    <Grid container xs={12}>
      <form onSubmit={formik.handleSubmit} style={{ width: "70vw" }}>
        <Grid container item>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="prefix" error={Boolean(formik.errors.prefix)}>
                Prefix
              </InputLabel>
              <Select
                labelId="prefix"
                id="prefix"
                name="prefix"
                value={formik.values.prefix}
                onChange={formik.handleChange}
                label="prefix"
                input={<Input />}
                error={formik.touched.prefix && Boolean(formik.errors.prefix)}
              >
                {validPrefix.map((v: string) => {
                  return (
                    <MenuItem key={v} value={v.toLowerCase()}>
                      {v}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText error>
                {formik.touched.prefix && formik.errors.prefix}
              </FormHelperText>
            </FormControl>
          </Grid>
          {formik.values.prefix !== "" && (
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="multiplier"
                name="multiplier"
                label="Multiplier"
                type="number"
                value={formik.values.multiplier}
                onChange={formik.handleChange}
                error={
                  formik.touched.multiplier && Boolean(formik.errors.multiplier)
                }
                helperText={
                  formik.touched.multiplier && formik.errors.multiplier
                }
              />
            </Grid>
          )}
        </Grid>

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
            label="units"
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
          </Select>
          <FormHelperText error>
            {formik.touched.units && formik.errors.units}
          </FormHelperText>
        </FormControl>

        <TextField
          fullWidth
          id="exponent"
          name="exponent"
          label="Exponent"
          type="number"
          value={formik.values.exponent}
          onChange={formik.handleChange}
          error={formik.touched.exponent && Boolean(formik.errors.exponent)}
          helperText={formik.touched.exponent && formik.errors.exponent}
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
                  Boolean(formik.errors.exponent) ||
                  Boolean(formik.errors.multiplier) ||
                  Boolean(formik.errors.prefix) ||
                  Boolean(formik.errors.units)
                ) &&
                formik.values.units
              ) {
                notifyAdd();
                return handleClose();
              }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </Grid>
  );
};

export { UnitChildForm };
