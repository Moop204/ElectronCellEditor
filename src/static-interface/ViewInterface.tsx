import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { useStyles } from './style';
import { Heading } from './Heading';
import { Link } from 'react-router-dom';

import CreateIcon from '@material-ui/icons/Create';
import StorageIcon from '@material-ui/icons/Storage';
import { dialog } from 'electron';
import { BrowserWindow } from 'electron/main';

const View = (prop: { valid: boolean }) => {
  const { valid } = prop;
  const styles = useStyles();

  return (
    <Grid container item>
      <Heading title="Views" />
      <Grid container item>
        <Grid item md={3}>
          <Tooltip title="Text View">
            <Link to="">
              <Button className={styles.viewButton}>Text</Button>
            </Link>
          </Tooltip>
        </Grid>
        <Grid item md={3}>
          <Tooltip title="Hierarchy View">
            <Link to="/spatial">
              <Button
                className={styles.viewButton}
                onClick={() => {
                  if (!valid) {
                    dialog.showMessageBox(window.open(), {
                      message:
                        'Current file is not valid CellML. Please fix before switching to concise view.',
                      type: 'info',
                      buttons: ['OK'],
                      title: 'Cannot use concise view with invalid file',
                    });
                  }
                }}
              >
                Concise
              </Button>
            </Link>
          </Tooltip>
        </Grid>
        <Grid item md={2}>
          <Tooltip title="Hide Interface">
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
