const { ipcRenderer } = require('electron');
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { AddChildren } from './static-interface/AddChildrenInterface';
import { Properties } from './static-interface/properties/PropertiesInterface';
import { Issues } from './static-interface/IssuesInterface';
import { View } from './static-interface/ViewInterface';
import { RawView } from './view/RawView';
import { SpatialView } from './view/SpatialView';
import Paper from '@material-ui/core/Paper';
import { ComponentEntity } from './types/ILibcellml';
import EditorXml from './view/EditorXml';
import styled from 'styled-components';

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

const MemeView = () => {
  return <div>OwO whats that UwU</div>;
};

const App = () => {
  const styles = useStyles();
  const [contentExist, setContentExist] = useState('');
  useEffect(() => {
    ipcRenderer.on('init-content', (event: Event, message: string) => {
      setContentExist(message);
    });
  }, []);

  const requestFile = (event: React.MouseEvent) => {
    ipcRenderer.invoke('loadFile', 'ping').then((res: any) => {
      setContentExist(res);
    });
  };

  return (
    <div className={styles.root}>
      <Router>
        <Grid container spacing={1} md={12}>
          <Grid item md={3}>
            <View />
            <Properties />
            <Issues />
          </Grid>
          <Grid item md={9}>
            <Paper className={styles.contentView}>
              <Paper className={styles.tabbing}>
                <button>ABC</button>
                <button>DEF</button>
              </Paper>
              <EditorXml xmlInput={contentExist} />

              <Switch>
                <Route exact path="/spatial">
                  <SpatialView
                    setContentExist={setContentExist}
                    contentExist={contentExist}
                  />
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

export default App;
