import React, { FunctionComponent } from "react";
import { useFormik } from "formik";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import * as yup from "yup";
import { Elements, elmToStr } from "../../../../../types/Elements";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
//import { ElementHelp } from "../../../../components/helper/ElementHelp";
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
      .matches(
        /^[a-zA-Z][a-zA-Z0-9_]*$/,
        "Valid characters include alphabetical, numerical and _"
      )
      .required('Attribute "name" is required')
      .notOneOf(curComponents, "Cannot be an existing component"),
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

const ComponentChildForm: FunctionComponent<IPopup> = ({
  parent,
  parentName,
  handleClose,
}) => {
  const namespaces = window.api.sendSync("all-components");
  const validationSchema = nameValidation(namespaces);

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
          type: Elements.component,
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
    enqueueSnackbar(`Successfully added component to ${parentName}`, {
      variant: "info",
    });
  };

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
                  Boolean(formik.errors.component_ref) ||
                  Boolean(formik.errors.source)
                )
              ) {
                notifyAdd();
                handleClose();
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

export { ComponentChildForm };
