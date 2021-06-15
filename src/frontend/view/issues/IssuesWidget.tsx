/* eslint-disable @typescript-eslint/no-shadow */
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import HintIcon from '@material-ui/icons/EmojiObjects';
import BugIcon from '@material-ui/icons/BugReport';
import { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Heading } from '../../components/Heading';
import { IssueText } from './IssueText';
import { IIssue } from './interface/IIssue';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    issueButtons: {
      height: '3vh',
      padding: '1vh',
      margin: '0px',
      borderRadius: '0px',
    },
  })
);

const IssuesWidget = ({ expanded }: { expanded: boolean }) => {
  const [issues, setIssues] = useState<IIssue[]>([]);
  const [errorMode, setErrorMode] = useState<boolean>(true);
  const [warningMode, setWarningMode] = useState<boolean>(true);
  const [hintMode, setHintMode] = useState<boolean>(true);

  const styles = useStyle();

  useEffect(() => {
    const errorReplyFn = (event: Event, issues: IIssue[]) => {
      setIssues(issues || []);
    };
    const dbErrorReplyFn = errorReplyFn;
    ipcRenderer.on('error-reply', dbErrorReplyFn);

    return () => {
      ipcRenderer.removeListener('error-reply', dbErrorReplyFn);
    };
  }, []);

  return (
    <Grid container item>
      <Grid item md={12}>
        <Heading title="Issues" />
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
  );
};

// todo chuck it all in issuetext
export { IssuesWidget };
