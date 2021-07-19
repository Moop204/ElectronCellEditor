import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import React, { useState, FunctionComponent } from "react";
import IPropertyAttribute from "../../../../types/IPropertyAttribute";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { EditorMonaco } from "../../../editor/raw/EditorMonaco";
import { PresentationMath } from "../../math/PresentationMath";
import { capitaliseFirst } from "../../../../utility/CapitaliseFirst";
import { FormControl, Select, Input, FormHelperText } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

import { Units } from "../../../../types/ILibcellml";
import { AllStandardUnits } from "../../../../utility/StandardUnitConverter";
import { AllInterfaceType } from "../../../../utility/InterfaceConverter";
import { ElementHelp } from "../../help/ElementHelp";
import { Elements } from "../../../../types/Elements";
import { VariableAttr } from "./VariableAttr";

const useStyle = makeStyles(() =>
  createStyles({
    mathEdit: {
      width: "80vw",
    },
    contentEdit: {
      width: "100%",
    },
    formHeader: {
      justifyContent: "space-between",
    },
  })
);

const isMathAttribute = (attr: string) => {
  switch (attr) {
    case "math":
    case "test_value":
    case "reset_value":
      return true;
    default:
      return false;
  }
};

const processAttribute = (title: string) => {
  if (title === "interfaceType") {
    return "Interface";
  } else if (title === "initialValue") {
    return "Init. Value";
  }

  title = capitaliseFirst(title);
  let words = title.split("_");

  return words.reduce((prev, cur, _idx, _arr) => {
    return prev + " " + capitaliseFirst(cur);
  });
};

const PropertyAttribute: FunctionComponent<IPropertyAttribute> = (props) => {
  const { title, value, onChange, index } = props;
  const [error, setError] = useState(false);
  // if (title === 'math') {
  //   return (
  //     <Grid container item direction="row">
  //       <InputLabel>{title}</InputLabel>
  //       <Math mathml={value} />
  //     </Grid>
  //   );
  // }

  // const [originalValue, setOriginalValue] = useState(value);

  if (title === "interfaceType") {
    const validInterface = AllInterfaceType();

    return (
      <Grid container item xs={12}>
        <Grid item xs={2}>
          <InputLabel>{processAttribute(title)}</InputLabel>
        </Grid>
        <Grid item xs={10}>
          <FormControl fullWidth>
            <Select
              labelId="interface"
              id="interface"
              name="interface"
              value={value}
              onChange={(e) => onChange(title, e.target.value, index)}
              label="units"
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
    );
  }

  if (title === "units") {
    let validUnits: string[] = AllStandardUnits();
    validUnits = [...validUnits, ...window.api.sendSync("all-units")];
    return (
      <Grid container item xs={12}>
        <Grid item xs={2}>
          <InputLabel>{processAttribute(title)}</InputLabel>
        </Grid>
        <Grid item xs={10}>
          <FormControl fullWidth>
            <Select
              labelId="units"
              id="units"
              name="units"
              value={value}
              onChange={(e) => onChange(title, e.target.value, index)}
              label="units"
              input={<Input />}
            >
              {validUnits.map((v: string) => {
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
    );
  } else if (isMathAttribute(title)) {
    const [mathSelect, setMathSelect] = useState(false);
    const handleClose = () => {
      setMathSelect(false);
      console.log(`Setting false: ${mathSelect}`);
    };
    const handleOpen = () => {
      setMathSelect(true);
      console.log(`Setting true: ${mathSelect}`);
    };
    const style = useStyle();

    return (
      <Grid container item direction="row">
        <Card>
          <Grid container>
            <Grid item xs={2}>
              <InputLabel>{processAttribute(title)}</InputLabel>
            </Grid>
            <Grid item xs={10}>
              <span onClick={handleOpen}>
                {value && (
                  <Button fullWidth>
                    <PresentationMath mathml={value} />
                  </Button>
                )}
                {!value && <TextField onSelect={handleOpen} />}
              </span>
            </Grid>
          </Grid>
          <Dialog
            open={mathSelect}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            className={style.contentEdit}
          >
            <DialogTitle id="form-dialog-title" className={style.formHeader}>
              <Grid container>
                <Grid item xs={8}>
                  Edit MathML
                </Grid>
                <Grid item xs={2}>
                  <ElementHelp type={Elements.math} />
                </Grid>
                <Grid item xs={2}>
                  <Button onClick={handleClose} color="primary">
                    Close
                  </Button>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent className={style.mathEdit}>
              <Grid container item xs={10}>
                <EditorMonaco
                  xmlInput={value}
                  onChange={(val: string) => {
                    onChange(title, val, index);
                  }}
                />
              </Grid>
            </DialogContent>
          </Dialog>
        </Card>
      </Grid>
    );
  } else {
    let form = (
      <TextField
        error={error}
        id={title}
        value={value}
        onChange={(e) => {
          if (e.target.value.match(/[^a-zA-Z_]/)) {
            setError(true);
          } else {
            setError(false);
            onChange(title, e.target.value, index);
          }
        }}
        helperText={
          error && "Only alphabetical letters and _ are valid characters."
        }
        rows={1}
        fullWidth
      />
    );
    switch (title) {
      case "variable":
      case "test_variable":
        form = (
          <VariableAttr
            title={title}
            value={value}
            index={index}
            onChange={onChange}
          />
        );
    }

    return (
      <div>
        <Grid container item direction="row">
          <Grid container item xs={12}>
            <Grid item xs={2}>
              <InputLabel id={title}>{processAttribute(title)}</InputLabel>
            </Grid>
            <Grid item xs={10}>
              {form}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
};

export default PropertyAttribute;
