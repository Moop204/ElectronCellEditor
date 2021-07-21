import { Grid } from "@material-ui/core";
import React from "react";
import { PropertiesWidget } from "../../properties/PropertiesWidget";

const SearchElement = () => {
  return (
    <Grid container>
      <Grid item xs={4}>
        <PropertiesWidget />
      </Grid>
    </Grid>
  );
};

export { SearchElement };
