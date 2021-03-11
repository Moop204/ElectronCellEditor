

const { ipcRenderer } = require('electron');
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { AddChildren } from "./static-interface/AddChildrenInterface";
import { Properties } from "./static-interface/PropertiesInterface";
import { Issues } from "./static-interface/IssuesInterface";
import { View } from "./static-interface/ViewInterface";
import { RawView } from "./view/RawView";
import Paper from "@material-ui/core/Paper";

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
});

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

const AutoGrid = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div></div>
      <Grid container spacing={1} md={12}>
        <Grid item md={3}>
          <View />
          <Properties />
          <Issues />
        </Grid>
        <Grid item md={9}>
          <Paper className={styles.contentView}> 
            <RawView></RawView>
          </Paper>
          <AddChildren />
        </Grid>
      </Grid>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={AutoGrid} />
      </Switch>
    </Router>
  );
}
