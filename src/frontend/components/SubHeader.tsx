import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as React from 'react';

interface ISubHeader {
  title: string;
}

const localStyles = makeStyles((theme: Theme) =>
  createStyles({
    subheading: {
      borderBottom: 'solid',
      marginTop: '1vh',
      fontSize: '1.5em',
      marginBottom: '1vh',
    },
  })
);

const SubHeader = (props: ISubHeader) => {
  const styles = localStyles();
  const { title } = props;
  return <div className={styles.subheading}>{title}</div>;
};

export { SubHeader };
