import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';

import React from 'react';
import { Level } from '../../../types/ILibcellml';
import { IIssueTextProp, IIssue } from './interface/IIssue';

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
  })
);

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

export { IssueText };
