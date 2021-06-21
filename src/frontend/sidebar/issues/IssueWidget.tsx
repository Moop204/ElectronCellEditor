/* eslint-disable @typescript-eslint/no-shadow */
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import WarningIcon from "@material-ui/icons/Warning";
import ErrorIcon from "@material-ui/icons/Error";
import HintIcon from "@material-ui/icons/EmojiObjects";
import BugIcon from "@material-ui/icons/BugReport";
import React, { useState, useEffect, FunctionComponent } from "react";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { IssueText } from "./IssueText";
import { IssueDescriptor } from "./Issue";
import { Paper, Typography } from "@material-ui/core";

const useStyle = makeStyles(() =>
  createStyles({
    issueButtons: {
      height: "3vh",
      padding: "1vh",
      margin: "0px",
      borderRadius: "0px",
    },
  })
);

interface IssuesProp {
  expanded: boolean;
}

const IssuesWidget: FunctionComponent<IssuesProp> = ({ expanded }) => {
  const [issues, setIssues] = useState<IssueDescriptor[]>([]);
  const [errorMode, setErrorMode] = useState<boolean>(true);
  const [warningMode, setWarningMode] = useState<boolean>(true);
  const [hintMode, setHintMode] = useState<boolean>(true);

  const styles = useStyle();

  useEffect(() => {
    const errorReplyFn = (event: Event, issues: IssueDescriptor[]) => {
      setIssues(issues || []);
      console.log("ERROR RECEIVED");
      console.log(issues);
    };
    const dbErrorReplyFn = errorReplyFn;
    window.api.receive("error-reply", dbErrorReplyFn);
  }, []);

  return (
    <Paper style={{ height: expanded ? "30%" : "80%" }}>
      <Typography variant="h4" style={{ paddingLeft: "5px" }}>
        Issues
      </Typography>
      <Grid container item xs={12}>
        <br />
        <Grid item md={12}>
          {expanded && (
            <span>
              <span>
                <IconButton
                  color="primary"
                  className={styles.issueButtons}
                  onClick={() => {
                    if (errorMode && warningMode && hintMode) {
                      setErrorMode(false);
                      setHintMode(false);
                      setWarningMode(false);
                    } else {
                      setErrorMode(true);
                      setHintMode(true);
                      setWarningMode(true);
                    }
                  }}
                >
                  <BugIcon />
                </IconButton>
              </span>
              <span>
                <IconButton
                  color="primary"
                  className={styles.issueButtons}
                  onClick={() => {
                    setErrorMode(!errorMode);
                  }}
                >
                  <ErrorIcon />
                </IconButton>
              </span>
              <span>
                <IconButton
                  color="primary"
                  className={styles.issueButtons}
                  onClick={() => {
                    setWarningMode(!warningMode);
                  }}
                >
                  <WarningIcon />
                </IconButton>
              </span>
              <span>
                <IconButton
                  color="primary"
                  className={styles.issueButtons}
                  onClick={() => {
                    setHintMode(!hintMode);
                  }}
                >
                  <HintIcon />
                </IconButton>
              </span>
            </span>
          )}
        </Grid>

        <Grid item md={12}>
          <IssueText issues={issues} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export { IssuesWidget };
