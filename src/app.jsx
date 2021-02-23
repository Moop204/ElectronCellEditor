import * as React from "react";
import * as ReactDOM from "react-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { AddChildren } from "./static-interface/AddChildrenInterface";
import { Properties } from "./static-interface/PropertiesInterface";
import { Issues } from "./static-interface/IssuesInterface";
import { View } from "./static-interface/ViewInterface";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginLeft: 0,
    },
    contentView: {
      height: "80vh",
    },
  })
);

export default function AutoGrid() {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div></div>
      <Grid container spacing={1}>
        <Grid item md={3}>
          <View />
          <Properties />
          <Issues />
        </Grid>
        <Grid item md={9}>
          <Paper className={styles.contentView}>xs</Paper>
          <AddChildren />
        </Grid>
      </Grid>
    </div>
  );
}

const Dashboard = () => {
  return <AutoGrid />;
};

function render() {
  ReactDOM.render(<Dashboard />, document.getElementById("app"));
}

render();
