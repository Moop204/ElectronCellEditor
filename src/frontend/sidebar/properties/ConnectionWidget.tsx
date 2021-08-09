import * as yup from "yup";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Elements } from "../../../types/Elements";
import { IChild } from "../../../types/IProperties";
import { ElementHelp } from "../help/ElementHelp";
import { RoundButton } from "../../component/RoundButton";
import { AddBadge } from "../../component/AddBadge";

import { PropertyIcon } from "./children/PropertyIcon";
import { Autocomplete } from "@material-ui/lab";
import { useFormik } from "formik";
import { DeleteButton } from "./children/DeleteButton";

interface IConnection {
  connection: IChild[];
}

const useStyle = makeStyles(() =>
  createStyles({
    buffer: {
      padding: "3vh",
    },
    button: {
      marginLeft: "2vh",
      marginRight: "7vh",
    },
    buttonText: {
      paddingLeft: "8px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      justifyContent: "left",
      textAlign: "justify",
      textTransform: "none",
    },
  })
);

interface IConnectionButton {
  name: string;
  index: number;
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

interface IComponentSelect {
  label: string;
  value: string;
  onChange: any;
}

const ComponentSelect: FunctionComponent<IComponentSelect> = ({
  label,
  value,
  onChange,
}) => {
  const style = useStyleVariable();
  const components = window.api.sendSync("all-components");

  return (
    <Autocomplete
      id="component1"
      style={{ width: 300 }}
      options={components}
      classes={{
        option: style.option,
      }}
      autoHighlight
      defaultValue={value}
      getOptionLabel={(option: string) => option}
      renderOption={(option) => <React.Fragment>{option}</React.Fragment>}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
          }}
        />
      )}
      onChange={onChange}
    />
  );
};

interface IVariableSelect extends IComponentSelect {
  componentName: string;
}
const VariableSelect: FunctionComponent<IVariableSelect> = ({
  label,
  value,
  onChange,
  componentName,
}) => {
  const style = useStyleVariable();
  const variables = window.api.sendSync("select-variables", componentName);

  return (
    <Autocomplete
      id="variable1"
      style={{ width: 300 }}
      options={variables}
      classes={{
        option: style.option,
      }}
      autoHighlight
      defaultValue={value}
      getOptionLabel={(option: string) => option}
      renderOption={(option) => <React.Fragment>{option}</React.Fragment>}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
          }}
        />
      )}
      onChange={onChange}
    />
  );
};

interface ConnectionDescriptor {
  component1: string;
  component2: string;
  variable1: string;
  variable2: string;
}

interface IEditConnectionForm {
  connection: ConnectionDescriptor;
  onClose: () => void;
}

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
            style={{ width: 300 }}
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

const ConnectionButton: FunctionComponent<IConnectionButton> = ({
  name,
  index,
}) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const style = useStyle();

  return (
    <>
      <RoundButton>
        <ListItem button onClick={handleOpen} dense>
          <ListItemIcon>
            <PropertyIcon element="connection" />
          </ListItemIcon>
          <ListItemText primary={name} />
          <ListItemSecondaryAction>
            <DeleteButton
              elementType={Elements.connection}
              name={name}
              index={index}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </RoundButton>
    </>
  );
};

const AddConnectionButton: FunctionComponent = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const style = useStyle();

  return (
    <>
      <RoundButton>
        <ListItem button onClick={handleOpen} dense>
          <ListItemIcon>
            <AddBadge>
              <PropertyIcon element="connection" />
            </AddBadge>
          </ListItemIcon>
          <ListItemText primary="Connection" />
        </ListItem>
      </RoundButton>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        style={{ padding: "8px" }}
      >
        <DialogTitle>
          <Grid container item direction="row">
            <Grid item xs={10}>
              <Typography variant="h4" style={{ paddingLeft: "5px" }}>
                Add Connection
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <ElementHelp type={Elements.connection} />
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent style={{}}>
          <AddConnectionForm
            connection={{
              component1: "",
              component2: "",
              variable1: "",
              variable2: "",
            }}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const ConnectionWidget: FunctionComponent<IConnection> = ({ connection }) => {
  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h4" style={{ paddingLeft: "5px" }}>
          Connection
        </Typography>
      </Grid>
      <List>
        {connection.map(({ name, index }) => (
          <ConnectionButton name={name} index={index} />
        ))}
      </List>
      <Grid item>
        <List>
          <AddConnectionButton />
        </List>
      </Grid>
    </Grid>
  );
};

export { ConnectionWidget };
