import { Grid, List, Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { IChild } from "../../../../types/IProperties";
import { AddConnectionButton } from "./AddConnectionButton";
import { ConnectionRecordButton } from "./ConnectionRecordButton";

interface IConnection {
  connection: IChild[];
}

// Describes section of properties window involving the Connection element
const ConnectionWidget: FunctionComponent<IConnection> = ({ connection }) => {
  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h4" style={{ paddingLeft: "5px" }}>
          Connection
        </Typography>
      </Grid>
      <List>
        {connection.map(({ name, index }) => (
          <ConnectionRecordButton name={name} index={index} />
        ))}
      </List>
      <Grid item>
        <List>
          <AddConnectionButton />
        </List>
      </Grid>
    </Grid>
  );
};

export { ConnectionWidget };
