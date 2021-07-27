import { Grid, Typography } from "@material-ui/core";
import React from "react";

const EmptyProperty = () => {
  return (
    <Grid item style={{ height: "100vh" }}>
      <Typography variant="h4" style={{ paddingLeft: "5px" }}>
        Properties
      </Typography>
      <Typography variant="body1" style={{ paddingLeft: "5px" }}>
        No CellML element available to select. Please use a valid CellML file.
      </Typography>
    </Grid>
  );
};

export { EmptyProperty };
