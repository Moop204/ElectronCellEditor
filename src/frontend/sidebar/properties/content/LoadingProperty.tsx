import { Grid, Typography } from "@material-ui/core";
import React from "react";

const LoadingProperty = () => {
  return (
    <Grid item style={{ height: "100vh" }}>
      <Typography variant="h4" style={{ paddingLeft: "5px" }}>
        Properties
      </Typography>
      LOADING ...
    </Grid>
  );
};

export { LoadingProperty };
