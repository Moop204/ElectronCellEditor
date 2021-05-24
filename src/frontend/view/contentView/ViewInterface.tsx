/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CreateIcon from '@material-ui/icons/Create';
import StorageIcon from '@material-ui/icons/Storage';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import { Heading } from '../../components/Heading';

const localStyle = makeStyles((theme: Theme) =>
  createStyles({
    viewButton: {
      maxWidth: '12rem',
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  })
);

const View = ({ valid }: { valid: boolean }) => {
  const styles = localStyle();

  return (
    <Grid container item>
      <Heading title="Views" />
      <Grid container item>
        <Grid item md={3}>
          <Tooltip title="Text View">
            <Link to="">
              <IconButton aria-label="Text View" color="primary">
                <CreateIcon />
              </IconButton>
            </Link>
          </Tooltip>
          {/* <Tooltip title="Text View">
            <Link to="">
              <Button className={styles.viewButton}>Text</Button>
            </Link>
          </Tooltip> */}
        </Grid>
        <Grid item md={3}>
          <Tooltip title="Concise View">
            <Link to="/spatial">
              <IconButton aria-label="Concise View" color="primary">
                <StorageIcon />
              </IconButton>
            </Link>
          </Tooltip>
          {/* <Tooltip title="Hierarchy View">
            <Link to="/spatial">
              <Button className={styles.viewButton}>Concise</Button>
            </Link>
          </Tooltip> */}
        </Grid>
        <Grid item md={2}>
          <Tooltip title="View Interface">
            <IconButton aria-label="View Interface" color="primary">
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          {/* <Tooltip title="Hide Interface">
            <Button className={styles.viewButton}>{'< o >'} </Button>
          </Tooltip> */}
        </Grid>
        <Grid item md={2}>
          {/* <Tooltip title="UNDO">
            <Button className={styles.viewButton}>{'<<'}</Button>
          </Tooltip> */}
          <Tooltip title="Undo">
            <IconButton aria-label="Undo action" color="primary">
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item md={2}>
          {/* <Tooltip title="REDO">
            <Button className={styles.viewButton}>{'>>'}</Button>
          </Tooltip> */}
          <Tooltip title="Redo">
            <IconButton aria-label="Redo Action" color="primary">
              <ArrowForwardIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default View;
