const { ipcRenderer } = require('electron');
import React, {useState} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { AddChildren } from './static-interface/AddChildrenInterface';
import { Properties } from './static-interface/PropertiesInterface';
import { Issues } from './static-interface/IssuesInterface';
import { View } from './static-interface/ViewInterface';
import { RawView } from './view/RawView';
import Paper from '@material-ui/core/Paper';
import { ComponentEntity } from './types/ILibcellml';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginLeft: 0,
    },
    contentView: {
      height: '80vh',
    },
    tabbing: {
      height: '4vh',
      backgroundColor: 'black',
      color: 'white',
    },
  })
);

const AutoGrid = () => {
  const styles = useStyles();


  return (
    <div className={styles.root}>
      <Grid container spacing={1} md={12}>
        <Grid item md={3}>
          <View />
          <Properties />
          <input type="file" id="file" />
          <Issues />
        </Grid>
        <Grid item md={9}>
          <Paper className={styles.contentView}>
            <Paper className={styles.tabbing}>
              <button>ABC</button>
              <button>DEF</button>
            </Paper>
            <RawView/>
          </Paper>
          <AddChildren />
        </Grid>
      </Grid>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={AutoGrid} />
      </Switch>
    </Router>
  );
}
