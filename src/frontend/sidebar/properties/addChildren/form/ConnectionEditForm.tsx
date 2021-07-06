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
import { InterfaceType } from "../../../../../types/ILibcellml";

interface IUnitEdit extends IPopup {
  unit: UnitDescriptor;
  index: number;
  interface: InterfaceType;
}

const updateUnitAttr = (index: number, attrType: string, attrVal: string) => {
  window.api.send("update-connection", [
    {
      element: Elements.units,
      select: {
        name: null,
        index: index,
      },
      attribute: attrType,
      value: attrVal,
    },
  ]);
};

const validation = (validUnits: string[]) =>
  yup.object({
    variable: yup.string().required().oneOf(validUnits),
  });

const ConnectionEditForm: FunctionComponent<IUnitEdit> = ({
  handleClose,
  index,
}) => {
  let validUnits: string[] = AllStandardUnits();
  validUnits = [...validUnits, ...window.api.sendSync("all-units")];
  const validPrefix = AllPrefix();
  const validationSchema = validation(validPrefix);

  const formik = useFormik({
    initialValues: {
      variable: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Grid container xs={12}>
      <form onSubmit={formik.handleSubmit} style={{ width: "70vw" }}>
        <Grid container>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="variable" error={Boolean(formik.errors.variable)}>
                Variable
              </InputLabel>
              <Select
                labelId="variable"
                id="variable"
                name="variable"
                value={formik.values.variable}
                onChange={formik.handleChange}
                label="variable"
                input={<Input />}
                error={
                  formik.touched.variable && Boolean(formik.errors.variable)
                }
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
                {formik.touched.variable && formik.errors.variable}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export { ConnectionEditForm };
