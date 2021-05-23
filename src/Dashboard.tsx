const { ipcRenderer } = require('electron');
import React, { useCallback, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { AddChildren } from './static-interface/AddChildrenInterface';
import PropertiesWidget from './static-interface/properties/PropertiesWidget';
import { Issues } from './static-interface/IssuesInterface';
import View from './static-interface/ViewInterface';
import { RawView } from './view/RawView';
import SpatialView from './view/SpatialView';
import Paper from '@material-ui/core/Paper';
import { ContentTracing } from 'electron';
import Alert from '@material-ui/lab/Alert';
import _ from 'lodash';
import { useRef } from 'react';

const localStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginLeft: 0,
    },
    contentView: {
      height: '100vh',
    },
    tabbing: {
      height: '4vh',
      backgroundColor: 'black',
      color: 'white',
    },
  })
);

const Dashboard = () => {
  const styles = localStyles();
  // Chuck in React Contexts
  const [contentExist, setContentExist] = useState('');
  const [valid, setValid] = useState(false);

  // const contentCallback = useCallback(() => {
  //   return getContentExists();
  // }, []);

  useEffect(() => {
    const updateContentFn = (event: Event, content: string) => {
      setContentExist(content);
      console.log('Update content B');
      ipcRenderer.send('get-element');
    };
    ipcRenderer.on('update-content-B', updateContentFn);

    const initContentFn = (event: Event, message: string) => {
      setContentExist(message);
    };
    ipcRenderer.on('init-content', initContentFn);

    const validatedFile = (event: Event, res: boolean) => {
      setValid(res);
    };

    ipcRenderer.on('validated-file', validatedFile);
    return () => {
      ipcRenderer.removeListener('update-content', updateContentFn);
      ipcRenderer.removeListener('init-content', initContentFn);
      ipcRenderer.removeListener('validated-file', validatedFile);
    };
  }, []);

  const validateFile = (c: string) => {
    ipcRenderer.send('validate-file', c);
  };

  const dbValidateFile = useCallback(
    _.debounce((c: string) => validateFile(c), 800),
    []
  );

  // Check here for sync problems?
  useEffect(() => {
    dbValidateFile(contentExist);
    // ipcRenderer.send('notify-backend', contentExist);
  }, [contentExist]);

  return (
    <div className={styles.root}>
      <Router>
        <Grid container spacing={1} md={12}>
          <Grid item md={3}>
            <View valid={valid} />

            <PropertiesWidget />
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
                  {!valid && <Redirect to="" />}
                  {valid && (
                    <SpatialView
                      contentExist={contentExist}
                      key="spatial-view"
                    />
                  )}
                </Route>
                <Route exact path="">
                  {!valid && (
                    <Alert severity="error">
                      File is not in valid CellML. You cannot use Concise View
                      without fixing this.
                    </Alert>
                  )}
                  {/* {contentExist} */}
                  <RawView
                    setContentExist={setContentExist}
                    contentExist={contentExist}
                    key="raw-view"
                  />
                </Route>
              </Switch>
            </Paper>
          </Grid>
        </Grid>
      </Router>
    </div>
  );
};

export { Dashboard };
