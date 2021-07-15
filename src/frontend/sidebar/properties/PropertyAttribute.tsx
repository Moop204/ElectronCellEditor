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
import IPropertyAttribute from "../../../types/IPropertyAttribute";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { EditorMonaco } from "../../editor/raw/EditorMonaco";
import { PresentationMath } from "../math/PresentationMath";
import { capitaliseFirst } from "../../../utility/CapitaliseFirst";
import { FormControl, Select, Input, FormHelperText } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

import { Units } from "../../../types/ILibcellml";
import { AllStandardUnits } from "../../../utility/StandardUnitConverter";
import { AllInterfaceType } from "../../../utility/InterfaceConverter";

const useStyle = makeStyles(() =>
  createStyles({
    mathEdit: {
      width: "80vw",
    },
    contentEdit: {
      width: "100%",
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
              onChange={(e) => onChange(title, e.target.value)}
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
              onChange={(e) => onChange(title, e.target.value)}
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
  }

  if (isMathAttribute(title)) {
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
            <Grid item xs={10} justifyContent="center">
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
            <DialogTitle id="form-dialog-title">Edit MathML</DialogTitle>
            <DialogContent className={style.mathEdit}>
              <Grid container item xs={10}>
                <EditorMonaco
                  xmlInput={value}
                  onChange={(val: string) => {
                    onChange(title, val);
                  }}
                />
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Grid>
    );
  }

  return (
    <div>
      <Grid container item direction="row">
        <Grid container item xs={12}>
          <Grid item xs={2}>
            <InputLabel>{processAttribute(title)}</InputLabel>
          </Grid>
          <Grid item xs={10}>
            <TextField
              value={value}
              onChange={(e) => onChange(title, e.target.value)}
              rows={1}
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default PropertyAttribute;
