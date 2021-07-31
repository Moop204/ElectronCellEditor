import { Grid } from "@material-ui/core";
import React from "react";
import { VariableDescriptor } from "../../../../utility/variable/getAllVariableNames";
import { PropertiesWidget } from "../../properties/PropertiesWidget";

const SearchElement = () => {
  let allVars: VariableDescriptor[] = window.api.sendSync("global-variable");

  return (
    <Grid container>
      <Grid item xs={4}>
        <PropertiesWidget />
      </Grid>
      <Grid item xs={8}>
        Placeholder
      </Grid>
    </Grid>
  );
};

export { SearchElement };
