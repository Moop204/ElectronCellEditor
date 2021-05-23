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
import _ from 'lodash';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import Heading from './Heading';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    errorMarker: {
      color: 'red',
    },
    warningMarker: {
      color: 'orange',
    },
    hintMarker: {
      color: 'green',
    },
    plainText: {
      color: 'black',
    },
    issueButtons: {
      height: '3vh',
      padding: '1vh',
      margin: '0px',
      borderRadius: '0px',
    },
  })
);

interface IssueRecord {
  desc: string;
  cause: string;
}

interface IIssueTextProp {
  issues: IIssue[];
}

interface IIssue {
  desc: string;
  cause: string;
}

const IssueText = (props: IIssueTextProp) => {
  const { issues } = props;
  const styles = useStyle();

  // TODO: turn to func for everyone
  if (issues.length > 0) {
    const mapErrors = issues.map((record) => {
      const { desc, cause } = record;
      return (
        <Grid item key={record.cause + record.desc}>
          <span className={styles.errorMarker}>{'>>>'}</span> {desc}
        </Grid>
      );
    });

    return (
      <div className={styles.plainText} key="issue-text">
        {mapErrors}
      </div>
    );
  }
  return (
    <Grid item className={styles.plainText}>
      No problems!
    </Grid>
  );
};

const Issues = () => {
  const [errors, setErrors] = useState<IIssue[]>([]);
  const [warnings, setWarnings] = useState<IIssue[]>([]);
  const [hints, setHints] = useState<IIssue[]>([]);
  const [errorMode, setErrorMode] = useState<boolean>(true);
  const [warningMode, setWarningMode] = useState<boolean>(true);
  const [hintMode, setHintMode] = useState<boolean>(true);

  const styles = useStyle();

  useEffect(() => {
    // TODO: Have individual issues contain their type
    const errorReplyFn = (event: Event, message) => {
      const { errors, warnings, hints } = message;
      setErrors(errors || []);
      setWarnings(warnings || []);
      setHints(hints || []);
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
      </Grid>

      <Grid item md={12}>
        <IssueText
          issues={(errorMode ? errors : [])
            .concat(warningMode ? warnings : [])
            .concat(hintMode ? hints : [])}
        />
      </Grid>
    </Grid>
  );
};

// todo chuck it all in issuetext
export { Issues };
