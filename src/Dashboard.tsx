const { ipcRenderer } = require('electron');
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { AddChildren } from './static-interface/AddChildrenInterface';
import { Properties } from './static-interface/properties/PropertiesInterface';
import { Issues } from './static-interface/IssuesInterface';
import { View } from './static-interface/ViewInterface';
import { RawView } from './view/RawView';
import { SpatialView } from './view/SpatialView';
import Paper from '@material-ui/core/Paper';
import { ContentTracing } from 'electron';

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

const Dashboard = () => {
  const styles = useStyles();
  const [contentExist, setContentExist] = useState('');
  const [valid, setValid] = useState(false);
  useEffect(() => {
    ipcRenderer.on('init-content', (event: Event, message: string) => {
      setContentExist(message);
    });
    ipcRenderer.on('validated-file', (event: Event, res: boolean) => {
      setValid(res);
    });
  }, []);

  useEffect(() => {
    ipcRenderer.send('validate-file', contentExist);
  }, [contentExist]);

  // Used by the menu opening
  const requestFile = (event: React.MouseEvent) => {
    ipcRenderer.invoke('loadFile', 'ping').then((res: any) => {
      setContentExist(res);
    });
  };

  useEffect(() => {
    ipcRenderer.send('update-content', contentExist);
  }, [contentExist]);

  return (
    <div className={styles.root}>
      <Router>
        <Grid container spacing={1} md={12}>
          <Grid item md={3}>
            <View valid={valid} />
            <Properties />
            <Issues />
          </Grid>
          <Grid item md={9}>
            <Paper className={styles.contentView}>
              <Paper className={styles.tabbing}>
                {/* <button>ABC</button>
                <button>DEF</button> */}
              </Paper>

              <Switch>
                <Route exact path="/spatial">
                  <SpatialView
                    setContentExist={setContentExist}
                    contentExist={contentExist}
                  />
                  {!valid && <Redirect to="" />}
                </Route>
                <Route exact path="">
                  <RawView
                    setContentExist={setContentExist}
                    contentExist={contentExist}
                    requestFile={requestFile}
                  />
                </Route>
              </Switch>
            </Paper>
            <AddChildren />
          </Grid>
        </Grid>
      </Router>
    </div>
  );
};

export { Dashboard };
