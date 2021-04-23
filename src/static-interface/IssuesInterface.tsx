/* eslint-disable @typescript-eslint/no-shadow */
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import HintIcon from '@material-ui/icons/EmojiObjects';
import BugIcon from '@material-ui/icons/BugReport';
import { useState } from 'react';
import { ipcRenderer } from 'electron';
import { useStyles, standardStyle } from './style';

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
  let val = 1;
  const styles = useStyles();

  if (issues.length > 0) {
    const mapIssues = issues.map((record: IssueRecord) => {
      const { desc, cause } = record;
      const key = `issue${val}`;
      val++;
      return (
        <Grid item key={key}>
          {' '}
          <span className={styles.issueMarker}>{'>>>'}</span> {desc}{' '}
        </Grid>
      );
    });

    return (
      <div className={styles.plainText} key="issue-text">
        {mapIssues}
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
  const [issueMode, setIssueMode] = useState<number>(0);

  const styles = useStyles();
  ipcRenderer.on('error-reply', (event: Event, message) => {
    const { modelErrors, modelWarnings, modelHints } = message;
    if (modelErrors == null) {
      const failedToParse: IIssue = {
        desc:
          "You've found a way to break the parser! At the moment we are using libcellml which is in development and cannot handle certain cases. If you're seeing this you may be providing non-numeric Unit prefixes.",
        cause: '',
      };
      setErrors([failedToParse]);
      setWarnings([]);
      setHints([]);
    } else {
      setErrors(modelErrors);
      setWarnings(modelWarnings);
      setHints(modelHints);
    }
  });

  const selectMode = (mode: number) => {
    setIssueMode(mode);
  };

  return (
    <Grid container item>
      <Grid item md={12} className={styles.heading}>
        <span className={styles.heading}>Issues</span>
        <span>
          <IconButton
            color="inherit"
            className={styles.issueButtons}
            onClick={() => selectMode(0)}
          >
            <BugIcon />
          </IconButton>
        </span>
        <span>
          <IconButton
            color="inherit"
            className={styles.issueButtons}
            onClick={() => selectMode(1)}
          >
            <ErrorIcon />
          </IconButton>
        </span>
        <span>
          <IconButton
            color="inherit"
            className={styles.issueButtons}
            onClick={() => selectMode(2)}
          >
            <WarningIcon />
          </IconButton>
        </span>
        <span color="#7986cb">
          <IconButton
            color="inherit"
            className={styles.issueButtons}
            onClick={() => selectMode(3)}
          >
            <HintIcon />
          </IconButton>
        </span>
      </Grid>

      <Grid item md={12}>
        <div className={styles.heading}>
          {issueMode === 0
            ? 'All Issues'
            : issueMode === 1
            ? 'Errors'
            : issueMode === 2
            ? 'Warnings'
            : 'Hints'}
        </div>
        {issueMode === 0 && (
          <IssueText issues={errors.concat(warnings.concat(hints))} />
        )}
        {issueMode === 1 && <IssueText issues={errors} />}
        {issueMode === 2 && <IssueText issues={warnings} />}
        {issueMode === 3 && <IssueText issues={hints} />}
      </Grid>
    </Grid>
  );
};

export { Issues };
