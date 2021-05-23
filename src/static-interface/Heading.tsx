import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography } from '@material-ui/core';

interface IHeadingProp {
  title: string;
}

const localStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      backgroundColor: 'black',
      flexgrow: '1',
      width: '100%',
      color: 'white',
      padding: '0.5rem',
      // justifyContent: 'space-between',
    },
  })
);

const Heading = ({ title }: IHeadingProp) => {
  const styles = localStyles();

  return (
    <Typography variant="h3" align="center" className={styles.heading}>
      {title}
    </Typography>
  );
};

export default Heading;
