import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { RawView } from "./editor/raw/RawView";
import { ConciseView } from "./editor/concise/ConciseView";
import { UnexpandedSidebar } from "./sidebar/UnexpandedSidebar";
import { ExpandedSidebar } from "./sidebar/ExpandedSidebar";
import _ from "lodash";
import { PresentationMath } from "./sidebar/math/PresentationMath";
import { SidebarManager } from "./sidebar/SidebarManager";
import MathJax from "mathjax3-react";

global.Buffer = global.Buffer || require("buffer").Buffer;

const localStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      marginLeft: 0,
    },
    contentView: {
      height: "100vh",
    },
    tabbing: {
      height: "4vh",
      backgroundColor: "black",
      color: "white",
    },
  })
);

// // Describes the layout of the window
const Dashboard: FunctionComponent = () => {
  const styles = localStyles();
  // Chuck in React Contexts
  const [contentExist, setContentExist] =
    useState(`<?xml version="1.0" encoding="UTF-8"?>
  <model xmlns="http://www.cellml.org/cellml/2.0#"
  xmlns:cellml="http://www.cellml.org/cellml/2.0#">

  </model>`);
  const [baseContent, setBaseContent] = useState(contentExist);
  const [valid, setValid] = useState(false);
  const [viewSidebar, setViewSidebar] = useState(true);

  const switchSidebar = () => {
    console.log("Switching sidebar to " + viewSidebar);
    setViewSidebar(!viewSidebar);
  };

  const [view, setView] = useState(false);

  const switchView = () => {
    if (valid) setView(!view);
  };
  // const contentCallback = useCallback(() => {
  //   return getContentExists();
  // }, []);

  useEffect(() => {
    const updateContentFn = (event: Event, content: string) => {
      setContentExist(content);
      console.log("Update content B");
      window.api.send("get-element");
    };
    window.api.receive("update-content-b", updateContentFn);
    const initContentFn = (event: Event, message: string) => {
      setContentExist(message);
    };
    window.api.receive("init-content", initContentFn);
    const validatedFile = (event: Event, res: boolean) => {
      setValid(res);
    };
    window.api.receive("validated-file", validatedFile);

    return () => {
      window.api.remove("init-content", initContentFn);
      window.api.remove("update-content-b", updateContentFn);
      window.api.remove("validated-file", validatedFile);
    };
  }, []);

  const validateFile = (c: string) => {
    window.api.send("validate-file", c);
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

  // return (
  //   <Router>
  //     <ExpandedSidebar
  //       content={contentExist}
  //       switchSidebar={switchSidebar}
  //       switchView={switchView}
  //       viewSidebar={true}
  //       view={true}
  //       valid={true}
  //       updateBaseContent={setBaseContent}
  //     />
  //   </Router>
  // );

  return (
    <div className={styles.root}>
      <MathJax.Provider>
        {/* <Router> */}
        <Grid container spacing={1} direction="row">
          <Grid item xs={viewSidebar ? 3 : 1}>
            {viewSidebar && (
              <ExpandedSidebar
                content={contentExist}
                switchSidebar={switchSidebar}
                switchView={switchView}
                viewSidebar={viewSidebar}
                view={view}
                valid={valid}
                updateBaseContent={setBaseContent}
              />
            )}
            {!viewSidebar && (
              <UnexpandedSidebar
                content={contentExist}
                baseContent={baseContent}
                switchSidebar={switchSidebar}
                switchView={switchView}
                viewSidebar={viewSidebar}
                view={view}
                valid={valid}
                updateBaseContent={setBaseContent}
              />
            )}
          </Grid>
          {/* <Grid item xs={viewSidebar ? 3 : 1}>
            <SidebarManager
              viewSidebar={viewSidebar}
              view={view}
              valid={valid}
              content={contentExist}
              baseContent={baseContent}
              setBaseContent={setBaseContent}
              switchSidebar={switchSidebar}
              switchView={switchView}
            />
          </Grid> */}

          <Grid item xs={viewSidebar ? 9 : 11}>
            <Paper className={styles.contentView}>
              <Paper className={styles.tabbing}></Paper>
              {/* <Switch>
                <Route exact path="/concise">
                  {!valid && <Redirect to="" />}
                  {valid && (
                    <ConciseView
                      contentExist={contentExist}
                      setContentExist={setContentExist}
                      key="concise-view"
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
                  <RawView
                    setContentExist={setContentExist}
                    contentExist={contentExist}
                    key="raw-view"
                  />
                </Route>
              </Switch> */}
            </Paper>
          </Grid>
        </Grid>
        {/* </Router> */}
      </MathJax.Provider>
    </div>
  );
};

export { Dashboard };
