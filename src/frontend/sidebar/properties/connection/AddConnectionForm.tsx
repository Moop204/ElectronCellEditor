import * as yup from "yup";
import { Grid, TextField, Button, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useFormik } from "formik";
import React, { FunctionComponent, useState, useEffect } from "react";
import { Elements } from "../../../../types/Elements";
import { ConnectionDescriptor } from "./ConnectionDescriptor";

interface IEditConnectionForm {
  connection: ConnectionDescriptor;
  onClose: () => void;
}

const useStyleVariable = makeStyles({
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
});

const AddConnectionForm: FunctionComponent<IEditConnectionForm> = ({
  connection,
  onClose,
}) => {
  const schema = yup.object({
    component1: yup.string().required(),
    component2: yup.string().required(),
    variable1: yup.string().required(),
    // variable2: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      component1: "",
      component2: "",
      variable1: "",
      variable2: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      window.api.send("add-child", {
        child: {
          type: Elements.connection,
          attribute: values,
        },
        parentType: Elements.variable,
      });
    },
  });

  const style = useStyleVariable();
  const components = window.api.sendSync("all-components");
  const [component1, setComponent1] = useState("");
  const [component2, setComponent2] = useState("");
  const [variable1, setVariable1] = useState("");
  const [variable2, setVariable2] = useState("");
  const [variables1, setVariables1] = useState(
    window.api.sendSync("select-variables", connection.component1)
  );
  const [variables2, setVariables2] = useState(
    window.api.sendSync("select-variables", connection.component2)
  );

  useEffect(() => {
    formik.values.component1 = component1;
    formik.values.variable1 = "";
    if (formik.values.component1) {
      setVariables1(
        window.api.sendSync("select-variables", formik.values.component1)
      );
    }
    setVariable1("");
  }, [component1]);
  useEffect(() => {
    formik.values.component2 = component2;
    formik.values.variable2 = "";
    if (formik.values.component2) {
      setVariables2(
        window.api.sendSync("select-variables", formik.values.component2)
      );
    }
    setVariable2("");
  }, [component2]);
  useEffect(() => {
    formik.values.variable1 = variable1;
  }, [variable1]);
  useEffect(() => {
    formik.values.variable2 = variable2;
  }, [variable2]);

  return (
    <Grid container direction="column" spacing={1} style={{ marginTop: "5px" }}>
      <Grid container item direction="row" justifyContent="center" spacing={2}>
        <Grid item>
          <Autocomplete
            id="component1"
            style={{ width: 300 }}
            options={components}
            classes={{
              option: style.option,
            }}
            autoHighlight
            defaultValue={formik.values.component1}
            value={component1}
            getOptionLabel={(option: string) => option}
            renderOption={(option) => <React.Fragment>{option}</React.Fragment>}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"Component 1"}
                variant="filled"
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
            onChange={(e, val) => {
              formik.handleChange(e);
              setComponent1(val);
              console.log("NEW VALUE IS ");
              console.log(val);
            }}
          />
        </Grid>
        <Grid item>
          <Autocomplete
            id="variable1"
            options={variables1}
            classes={{
              option: style.option,
            }}
            autoHighlight
            defaultValue={formik.values.variable1}
            value={variable1}
            getOptionLabel={(option: string) => option}
            renderOption={(option) => <React.Fragment>{option}</React.Fragment>}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"Variable 1"}
                variant="filled"
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
            onChange={(e, val) => {
              formik.handleChange(e);
              formik.values.variable1 = val;
              setVariable1(val);
            }}
          />
        </Grid>
      </Grid>
      <Grid container item direction="row" justifyContent="center" spacing={2}>
        <Grid item>
          <Autocomplete
            id="component2"
            style={{ width: 300 }}
            options={components}
            classes={{
              option: style.option,
            }}
            autoHighlight
            defaultValue={formik.values.component2}
            value={component2}
            getOptionLabel={(option: string) => option}
            renderOption={(option) => <React.Fragment>{option}</React.Fragment>}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"Component 2"}
                variant="filled"
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
            onChange={(e, val) => {
              formik.handleChange(e);
              setComponent2(val);
            }}
          />
        </Grid>
        <Grid item>
          <Autocomplete
            id="variable2"
            style={{ width: 300 }}
            options={variables2}
            classes={{
              option: style.option,
            }}
            autoHighlight
            defaultValue={formik.values.variable2}
            value={variable2}
            getOptionLabel={(option: string) => option}
            renderOption={(option) => <React.Fragment>{option}</React.Fragment>}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"Variable 2"}
                variant="filled"
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
            onChange={(e, val) => {
              formik.handleChange(e);
              formik.values.variable2 = val;
              setVariable2(val);
            }}
          />
        </Grid>
      </Grid>
      <Grid item container spacing={1}>
        <Grid item xs={6}>
          <Button
            onClick={onClose}
            color="primary"
            variant="contained"
            fullWidth
          >
            Close
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            fullWidth
            onClick={() => {
              if (
                !(
                  Boolean(formik.errors.component1) ||
                  Boolean(formik.errors.component2) ||
                  Boolean(formik.errors.variable1) ||
                  Boolean(formik.errors.variable2)
                )
              ) {
                onClose();
                formik.submitForm();
              } else {
                console.log(formik.errors);
              }
            }}
          >
            Add Connection
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { AddConnectionForm };
