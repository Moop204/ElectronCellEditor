const { ipcRenderer } = require('electron');
import React, { useCallback, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { RawView } from './contentView/rawView/RawView';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { PropertiesWidget } from './properties/PropertiesWidget';
import { IssuesWidget } from './issues/IssuesWidget';
import { OptionWidget } from '../optionSelect/OptionWidget';
import { SpatialView } from './contentView/treeView/SpatialView';
import Paper from '@material-ui/core/Paper';
import { ContentTracing } from 'electron';
import Alert from '@material-ui/lab/Alert';
import _ from 'lodash';
import { Math, PresentationMath } from '../components/math/Math';
import { VerticalOptionWidget } from '../optionSelect/VerticleOptionWidget';
//import { PDFReader } from 'reactjs-pdf-reader';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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

// Describes the layout of the window
const Dashboard = () => {
  const styles = localStyles();
  // Chuck in React Contexts
  const [
    contentExist,
    setContentExist,
  ] = useState(`<?xml version="1.0" encoding="UTF-8"?>
<model xmlns="http://www.cellml.org/cellml/2.0#" 
xmlns:cellml="http://www.cellml.org/cellml/2.0#" 
xmlns:xlink="http://www.w3.org/1999/xlink">

</model>`);
  const [valid, setValid] = useState(false);
  const [viewSidebar, setViewSidebar] = useState(false);

  const switchSidebar = () => {
    console.log('Switching sidebar to ' + viewSidebar);
    setViewSidebar(!viewSidebar);
  };

  const [view, setView] = useState(false);

  const switchView = () => setView(!view);
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
      // ipcRenderer.removeListener('update-content', updateContentFn);
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

  const [pageNum, setPageNum] = useState(1);
  const [open, setOpen] = useState(false);
  // return (
  //   <div>
  //     <Button onClick={() => setOpen(true)}>Help</Button>
  //     <Dialog
  //       disableBackdropClick
  //       disableEscapeKeyDown
  //       open={open}
  //       onClose={() => setOpen(false)}
  //     >
  //       <DialogTitle>
  //         Test PDF
  //       </DialogTitle>
  //       <DialogContent>
  //         <Button onClick={() => setPageNum(pageNum - 1)}>{"<<<"}</Button>
  //         <Button onClick={() => setPageNum(pageNum + 1)}>>>></Button>
  //         <Document file="../src/frontend/media/cellml_2_0_normative_specification.pdf">
  //           <Page pageNumber={pageNum} />
  //         </Document>
  //       </DialogContent>
  //     </Dialog>
  //   </div>
  // );

  return (
    <div className={styles.root}>
      <Router>
        <Grid container spacing={1}>
          {viewSidebar && (
            <Grid item md={3}>
              <OptionWidget
                content={contentExist}
                switchSidebar={switchSidebar}
                switchView={switchView}
              />

              <PropertiesWidget />
              <IssuesWidget expanded={viewSidebar} />
            </Grid>
          )}
          {!viewSidebar && (
            <Grid item md={1}>
              <VerticalOptionWidget
                content={contentExist}
                switchSidebar={switchSidebar}
                switchView={switchView}
              />
              <IssuesWidget expanded={viewSidebar} />
            </Grid>
          )}

          <Grid item md={viewSidebar ? 9 : 11}>
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
