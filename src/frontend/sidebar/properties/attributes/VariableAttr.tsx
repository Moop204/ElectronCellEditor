import {
  Grid,
  InputLabel,
  FormControl,
  Select,
  Input,
  TextField,
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import React, { FunctionComponent } from "react";
import { VariableDescriptor } from "../../../../utility/variable/getAllVariableNames";
import { Autocomplete } from "@material-ui/lab";

interface IVariableAttr {
  title: string;
  value: string;
  index: number;
  onChange: any;
}

const VariableAttr: FunctionComponent<IVariableAttr> = ({
  value,
  index,
  onChange,
  title,
}) => {
  let validVariable: VariableDescriptor[] =
    window.api.sendSync("global-variable");
  const initVal = value;
  // Refactor out
  // const name = window.api.sendSync("parent-name");
  return (
    <FormControl fullWidth>
      {/* <Autocomplete
        id="editingVariable"
        options={validVariable.map((v: VariableDescriptor) => v.variable)}
        defaultValue={value}
        renderInput={(params) => (
          <TextField
            {...params}
            label={title}
            margin="normal"
            variant="outlined"
          />
        )}
        onChange={(e, v) => onChange(title, v, index)}
      /> */}

      <Select
        labelId="editingVariable"
        id="editingVariable"
        name="editingVariable"
        value={initVal}
        onChange={(e) => onChange(title, e.target.value, index)}
        label="editingVariable"
        input={<Input />}
        variant="outlined"
      >
        {validVariable.map((v: VariableDescriptor) => {
          return (
            <MenuItem key={v.variable} value={v.variable}>
              {v.variable}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export { VariableAttr };
