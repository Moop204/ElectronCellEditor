import { Grid, Typography } from "@material-ui/core";
import { ElementHelp } from "../../../../frontend/sidebar/help/ElementHelp";
import React, { FunctionComponent } from "react";
import { Elements } from "../../../../types/Elements";

const UnitHeading: FunctionComponent<{}> = () => {
  return (
    <Grid container item direction="row">
      <Grid item xs={9}>
        <Typography variant="h4" style={{ paddingLeft: "5px" }}>
          Edit Unit
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <ElementHelp type={Elements.unit} />
      </Grid>
    </Grid>
  );
};

export { UnitHeading };
