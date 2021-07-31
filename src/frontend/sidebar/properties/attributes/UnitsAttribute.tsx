import {
  Grid,
  InputLabel,
  FormControl,
  Select,
  Input,
  MenuItem,
} from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { allStandardUnits } from "../../../../utility/standardUnitConverter";

interface IUnitsAttribute {
  title: string;
  index: number;
  value: string;
  onChange: any;
}

const UnitsAttribute: FunctionComponent<IUnitsAttribute> = ({
  title,
  index,
  value,
  onChange,
}) => {
  let validUnits: string[] = allStandardUnits();
  validUnits = [...validUnits, ...window.api.sendSync("all-units")];
  return (
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
  );
};

export { UnitsAttribute };
