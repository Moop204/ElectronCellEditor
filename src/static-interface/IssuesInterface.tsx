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
import { Level } from '../types/ILibcellml';
import { Heading } from '../frontend/Heading';

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
    markerPadding: {
      paddingRight: '2vh',
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

interface IIssueTextProp {
  issues: IIssue[];
}

interface IIssue {
  desc: string;
  cause: string;
  type: Level;
}

const ErrorComponent = ({ desc }: { desc: string }) => {
  const style = useStyle();
  return (
    <span>
      <span className={[style.errorMarker, style.markerPadding].join(' ')}>
        {'>>>'}
      </span>
      {desc}
    </span>
  );
};
const WarningComponent = ({ desc }: { desc: string }) => {
  const style = useStyle();
  return (
    <span>
      <span className={[style.warningMarker, style.markerPadding].join(' ')}>
        {'>>>'}
      </span>
      {desc}
    </span>
  );
};

const HintComponent = ({ desc }: { desc: string }) => {
  const style = useStyle();
  return (
    <span>
      <span className={[style.hintMarker, style.markerPadding].join(' ')}>
        {'>>>'}
      </span>
      {desc}
    </span>
  );
};

const IssueText = (props: IIssueTextProp) => {
  const { issues } = props;
  let val = 1;
  const styles = useStyle();

  if (issues.length > 0) {
    const mapIssues = issues.map((record: IIssue) => {
      const { desc, cause, type } = record;
      const key = `issue${val}`;
      val += 1;
      return (
        <Grid item key={key}>
          {type === Level.ERROR && <ErrorComponent desc={desc} />}
          {type === Level.WARNING && <WarningComponent desc={desc} />}
          {type === Level.HINT && <HintComponent desc={desc} />}
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
        <span>
          <IconButton
            color="inherit"
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
            color="inherit"
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
            color="inherit"
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
            color="inherit"
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
        <IssueText issues={issues} />
      </Grid>
    </Grid>
  );
};

// todo chuck it all in issuetext
export { Issues };
