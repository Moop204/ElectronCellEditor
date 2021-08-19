import {
  Grid,
  InputLabel,
  FormControl,
  Select,
  Input,
  MenuItem,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { Label } from "@material-ui/icons";
import React, { FunctionComponent } from "react";
import { allStandardUnits } from "../../../../utility/standardUnitConverter";

interface IUnitsAttribute {
  title: string;
  index: number;
  value: string;
  onChange: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      // margin: theme.spacing(1),
      // minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

const UnitsAttribute: FunctionComponent<IUnitsAttribute> = ({
  title,
  index,
  value,
  onChange,
}) => {
  let validUnits: string[] = allStandardUnits();
  validUnits = [...validUnits, ...window.api.sendSync("all-units")];
  const style = useStyles();
  return (
    <FormControl fullWidth variant="outlined" id={"units"}>
      <InputLabel id="units-label">units</InputLabel>
      <Select
        labelId="units-label"
        id="units"
        value={value}
        label="Units"
        native
        fullWidth
        onChange={(e) => onChange(title, e.target.value, index)}
      >
        {validUnits.map((v: string) => {
          return (
            <option key={v} value={v.toLowerCase()}>
              {v}
            </option>
          );
        })}
      </Select>
    </FormControl>
  );
};

export { UnitsAttribute };
