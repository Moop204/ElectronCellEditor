import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import React, { useState, FunctionComponent } from "react";
import IPropertyAttribute from "../../../../types/IPropertyAttribute";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { PresentationMath } from "../../math/PresentationMath";
import { capitaliseFirst } from "../../../../utility/capitaliseFirst";
import { FormControl, Select, Input } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import { AllInterfaceType } from "../../../../utility/interfaceConverter";
import { VariableAttr } from "./VariableAttr";
import { EditMathDialog } from "./EditMathDialog";
import { UnitsAttribute } from "./UnitsAttribute";
import _ from "lodash";
import { Autocomplete } from "@material-ui/lab";

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

  const [localValue, setLocalValue] = useState(value);

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
      <>
        {/* <Grid item xs={2}>
          <InputLabel>{processAttribute(title)}</InputLabel>
        </Grid> */}
        {/* <Grid item xs={10}> */}
        <FormControl variant="outlined" fullWidth id={title}>
          <InputLabel id="interface-label">interface</InputLabel>
          <Select
            labelId="interface-label"
            id="interfaceType"
            value={value}
            fullWidth
            onChange={(e) => onChange(title, e.target.value, index)}
            label="units"
            // input={<Input />}
            // input={
            //   <input
            //     aria-hidden="true"
            //     className="MuiSelect-nativeInput"
            //     id="interfaceType"
            //   />
            // }
            native
          >
            {validInterface.map((v: string) => {
              return (
                <option key={v} value={v.toLowerCase()}>
                  {v}
                </option>
              );
            })}
          </Select>
        </FormControl>
        {/* </Grid> */}

        {/* <Autocomplete
          id={title}
          options={validInterface}
          fullWidth
          classes={
            {
              // option: style.option,
            }
          }
          autoHighlight
          defaultValue={value}
          value={value}
          getOptionLabel={(option: string) => option}
          renderOption={(option: string) => (
            <React.Fragment>{option}</React.Fragment>
          )}
          renderInput={(params: any) => (
            <TextField
              {...params}
              label={"interface"}
              variant="filled"
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
          onChange={(e, val) => {
            onChange(title, val, index);
          }}
        /> */}
      </>
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
        defaultValue={localValue}
        variant="outlined"
        label={processAttribute(title)}
        onSubmit={() => {
          console.log("I submit ><><><><><><>");
        }}
        onChange={(e) => {
          if (
            e.target.value.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/) ||
            e.target.value === ""
          ) {
            setLocalValue(e.target.value);
            if (e.target.value !== "") {
              setError(false);
              console.log("Local value HAS STUFF");
            }
            if (e.target.value === "") {
              setError(true);
              console.log("Local value IS EMPTY");
            }
            if (!error) {
              console.log("NOTHING WRONG WITH INPUT");
              console.log(localValue);
              // onChange(title, e.target.value, index);
            }
          } else {
            if (!error) setError(true);
            e.target.value = localValue;
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
            defaultValue={value}
            label="initial value"
            variant="outlined"
            onChange={(e) => {
              if (e.target.value.match(/[^a-zA-Z_0-9]/)) {
                setError(true);
                e.target.value = localValue;
              } else {
                setError(false);
                setLocalValue(e.target.value);
                // onChange(title, e.target.value, index);
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
        <Grid container item direction="row" style={{ margin: "4px" }}>
          {/* <Grid container item xs={12}> */}
          {/* <Grid item xs={2}>
              <InputLabel id={title}>{processAttribute(title)}</InputLabel>
            </Grid> */}
          {form}
          {/* </Grid> */}
        </Grid>
      </div>
    );
  }
};

export { PropertyAttribute, processAttribute };
