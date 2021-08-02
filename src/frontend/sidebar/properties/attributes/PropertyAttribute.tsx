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
import { PresentationMath } from "../../math/PresentationMath";
import { capitaliseFirst } from "../../../../utility/capitaliseFirst";
import { FormControl, Select, Input, FormHelperText } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import { AllInterfaceType } from "../../../../utility/interfaceConverter";
import { VariableAttr } from "./VariableAttr";
import { EditMathDialog } from "./EditMathDialog";
import { UnitsAttribute } from "./UnitsAttribute";
import _ from "lodash";

const useStyle = makeStyles(() =>
  createStyles({
    mathEdit: {
      width: "100vw",
    },
    contentEdit: {
      width: "100vw",
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
        <Grid container item>
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
        <EditMathDialog
          open={mathSelect}
          title={title}
          index={index}
          updateDetail={onChange}
          handleClose={handleClose}
          value={value}
        />
      </Grid>
    );
  } else {
    let form = (
      <TextField
        error={error}
        id={title}
        value={value}
        onChange={(e) => {
          if (
            e.target.value.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/) ||
            e.target.value === ""
          ) {
            if (error) setError(false);
            /*_.debounce(() =>*/ onChange(
              title,
              e.target.value,
              index
            ); /*, 100);*/
          } else {
            if (!error) setError(true);
          }
        }}
        helperText={
          error &&
          "Only alphanumerical characters and _ are allowed and cannot start with a number"
        }
        rows={1}
        fullWidth
      />
    );
    switch (title) {
      case "initialValue":
        form = (
          <TextField
            error={error}
            id={title}
            value={value}
            onChange={(e) => {
              if (e.target.value.match(/[^a-zA-Z_0-9]/)) {
                setError(true);
              } else {
                setError(false);
                onChange(title, e.target.value, index);
              }
            }}
            helperText={
              error &&
              "Only alphanumerical characters and _ are allowed and cannot start with a number"
            }
            rows={1}
            fullWidth
          />
        );

        break;
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
        break;
      case "units":
        form = (
          <UnitsAttribute
            title={title}
            index={index}
            value={value}
            onChange={onChange}
          />
        );
        break;
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

export { PropertyAttribute, processAttribute };
