import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { useStyles } from './style';
import { Heading } from './Heading';
import { Link } from 'react-router-dom';

const View = () => {
  const styles = useStyles();

  return (
    <Grid container item>
      <Heading title="Views" />
      <Grid container item>
        <Grid item md={2}>
          <Tooltip title="Text View">
            <Button className={styles.viewButton}>
              <Link to="/spatial">Y</Link>
            </Button>
          </Tooltip>
        </Grid>
        <Grid item md={2}>
          <Tooltip title="Hierarchy View">
            <Button className={styles.viewButton}>
              <Link to="/">Z</Link>
            </Button>
          </Tooltip>
        </Grid>
        <Grid item md={2}>
          <Tooltip title="Hide Interface">
            <Button className={styles.viewButton}>X</Button>
          </Tooltip>
        </Grid>
        <Grid item md={2}>
          <Tooltip title="Show Interface (TO BE REMOVED?)">
            <Button className={styles.viewButton}>X</Button>
          </Tooltip>
        </Grid>
        <Grid item md={2}>
          <Tooltip title="UNDO">
            <Button className={styles.viewButton}>X</Button>
          </Tooltip>
        </Grid>
        <Grid item md={2}>
          <Tooltip title="REDO">
            <Button className={styles.viewButton}>X</Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { View };
