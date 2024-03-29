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
import { Box, Paper, Typography } from "@material-ui/core";
import { Level } from "../../../types/ILibcellml";

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
  let errorCount = 0;
  let warningCount = 0;
  let hintCount = 0;
  issues.length > 0 &&
    issues.map((val) => {
      if (val.type === Level.ERROR) {
        errorCount++;
      } else if (val.type === Level.WARNING) {
        warningCount++;
      } else {
        hintCount++;
      }
    });

  useEffect(() => {
    const errorReplyFn = (event: Event, issues: IssueDescriptor[]) => {
      console.log(issues);
      setIssues(issues || []);
    };
    const dbErrorReplyFn = errorReplyFn;
    window.api.receive("error-reply", dbErrorReplyFn);
    return () => {
      window.api.remove("error-reply", dbErrorReplyFn);
    };
  }, []);
  if (!expanded) {
    return (
      <Box style={{ height: "58%", backgroundColor: "#ffff" }}>
        <Grid
          container
          direction="row"
          style={{ height: "45%" }}
          justifyContent="space-around"
        >
          <Grid item container direction="row" justifyContent="center" xs={12}>
            <IconButton
              color="secondary"
              disableRipple
              disableTouchRipple
              style={{ backgroundColor: "transparent" }}
              disabled={errorCount === 0}
            >
              <ErrorIcon /> {errorCount !== 0 && errorCount}
            </IconButton>
          </Grid>
          <Grid item container direction="row" justifyContent="center" xs={12}>
            <IconButton
              color="secondary"
              disableRipple
              disableTouchRipple
              style={{ backgroundColor: "transparent" }}
              disabled={warningCount === 0}
            >
              <WarningIcon /> {warningCount !== 0 && warningCount}
            </IconButton>
          </Grid>
          <Grid item container direction="row" justifyContent="center" xs={12}>
            <IconButton
              color="secondary"
              disableRipple
              disableTouchRipple
              style={{ backgroundColor: "transparent" }}
              disabled={hintCount === 0}
            >
              <HintIcon /> {hintCount !== 0 && hintCount}
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    );
  }
  return (
    <Paper style={{ height: "95vh", maxHeight: "95vh", overflowY: "auto" }}>
      <Grid container style={{ padding: "5px", paddingBottom: "16px" }}>
        <Grid item xs={5}>
          <Typography variant="h4">Issues</Typography>
        </Grid>
        {/* <Grid container item xs={7}>
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
        </Grid> */}

        <Grid item md={12} style={{ overflowY: "auto" }}>
          <IssueText issues={issues} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export { IssuesWidget };
