import React, { FunctionComponent, useState } from "react";
import { useFormik } from "formik";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import * as yup from "yup";
import { Elements } from "../../../../../types/Elements";
import Button from "@material-ui/core/Button";
import { AllStandardUnits } from "../../../../../utility/StandardUnitConverter";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import { AllPrefix } from "../../../../../utility/PrefixConverter";
import { IPopup } from "../IPopup";
import { IUnitForm } from "../../UnitWidget";
import { UnitDescriptor } from "../../../../../types/UnitDescriptor";
import { updateAttr } from "../../PropertiesWidget";
import { IUpdate } from "../../../../../types/IQuery";

interface IUnitEdit extends IPopup {
  unit: UnitDescriptor;
  index: number;
}

const updateUnitAttr = (index: number, attrType: string, attrVal: string) => {
  window.api.send("update-attribute", {
    element: Elements.units,
    select: {
      name: null,
      index: index,
    },
    parentSelect: null,
    attribute: attrType,
    value: attrVal,
  } as IUpdate);
};

const validation = (validPrefix: string[], validUnits: string[]) =>
  yup.object({
    prefix: yup.string(),
    multiplier: yup.string(),
    exponent: yup.string(),
    units: yup.string().required().oneOf(validUnits),
  });

const UnitEditForm: FunctionComponent<IUnitEdit> = ({
  parent,
  parentName,
  handleClose,
  index,
  unit: { reference, prefix, exponent, multiplier },
}) => {
  let validUnits: string[] = AllStandardUnits();
  validUnits = [...validUnits, ...window.api.sendSync("all-units")];
  const validPrefix = AllPrefix();
  const validationSchema = validation(validPrefix, validUnits);
  const [baseReference, setReference] = useState(reference);
  const [baseExponent, setExponent] = useState(exponent);
  const [basePrefix, setPrefix] = useState(prefix);
  const [baseMultiplier, setMultiplier] = useState(multiplier);

  const formik = useFormik({
    initialValues: {
      prefix: prefix,
      multiplier: multiplier,
      exponent: exponent,
      units: reference,
    },
    validationSchema,
    onSubmit: (values) => {
      Object.entries(values).map(([key, value]) => {
        if (key === "units" && value !== baseReference) {
          updateUnitAttr(index, "units_reference", value as string);
        } else if (key === "prefix" && value !== basePrefix) {
          updateUnitAttr(index, "prefix", value as string);
        } else if (key === "multiplier" && value !== baseMultiplier) {
          updateUnitAttr(index, "multiplier", value as string);
        } else if (key === "exponent" && value !== baseExponent) {
          updateUnitAttr(index, "exponent", value as string);
        }
      });
    },
  });

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
                  Boolean(formik.errors.exponent) ||
                  Boolean(formik.errors.multiplier) ||
                  Boolean(formik.errors.prefix) ||
                  Boolean(formik.errors.units)
                ) &&
                formik.values.units
              ) {
                console.log(">>> <<<<");
                return handleClose();
              }
            }}
          >
            Apply Change
          </Button>
        </DialogActions>
      </form>
    </Grid>
  );
};

export { UnitEditForm };
