import React, { FunctionComponent } from "react";
import { useFormik } from "formik";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import * as yup from "yup";
import { Elements } from "../../../../../types/Elements";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useSnackbar } from "notistack";

const nameValidation = (curComponents: string[]) =>
  yup.object({
    name: yup
      .string()
      .min(1, "Require at least one character")
      .matches(
        /^[a-zA-Z][a-zA-Z0-9_]*$/,
        "Must start with an alphabetical character"
      )
      .required('Attribute "name" is required')
      .notOneOf(curComponents, "Cannot be an existing Units"),
    source: yup.string().ensure().when("imported", {
      is: true,
      then: yup.string().required(),
    }),
    component_ref: yup.string().ensure().when("imported", {
      is: true,
      then: yup.string().required(),
    }),
  });

interface IPopup {
  parent: Elements;
  parentName: string;
  handleClose: () => void;
}

const UnitsChildForm: FunctionComponent<IPopup> = ({
  parent,
  parentName,
  handleClose,
}) => {
  const namespaces = window.api.sendSync("all-units");
  console.log(namespaces);
  const validationSchema = nameValidation(namespaces);

  const { enqueueSnackbar } = useSnackbar();
  const notifyAdd = () => {
    enqueueSnackbar(`Successfully added Units to ${parentName}`, {
      variant: "info",
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      imported: false,
      source: "",
      component_ref: "",
    },
    validationSchema,
    onSubmit: (values) => {
      window.api.send("add-child", {
        child: {
          type: Elements.units,
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

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          required
          fullWidth
          id="name"
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <FormControlLabel
          control={
            <Checkbox
              id="imported"
              name="imported"
              checked={formik.values.imported}
              onChange={formik.handleChange}
            />
          }
          label="Imported"
        />
        {formik.values.imported && (
          <div>
            <TextField
              required
              fullWidth
              id="source"
              name="source"
              label="Source"
              value={formik.values.source}
              onChange={formik.handleChange}
              error={formik.touched.source && Boolean(formik.errors.source)}
              helperText={formik.touched.source && formik.errors.source}
            />
            <TextField
              required
              fullWidth
              id="component_ref"
              name="component_ref"
              label="Component Reference"
              value={formik.values.component_ref}
              onChange={formik.handleChange}
              error={
                formik.touched.component_ref &&
                Boolean(formik.errors.component_ref)
              }
              helperText={
                formik.touched.component_ref && formik.errors.component_ref
              }
            />
          </div>
        )}
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
                  Boolean(formik.errors.imported) ||
                  Boolean(formik.errors.name) ||
                  Boolean(formik.errors.source) ||
                  Boolean(formik.errors.component_ref)
                )
              ) {
                notifyAdd();
                return handleClose();
              } else {
                console.log(formik.errors);
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

export { UnitsChildForm };
