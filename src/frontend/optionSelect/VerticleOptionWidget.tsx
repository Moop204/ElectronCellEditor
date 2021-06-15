/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Heading } from '../components/Heading';
import { TextViewButton } from './TextViewButton';
import { SpatialViewButton } from './SpatialViewButton';
import { VisibilityButton } from './VisibilityButton';
import { UndoButton } from './UndoButton';
import { RedoButton } from './RedoButton';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { ipcRenderer } from 'electron';
import { makeStyles } from '@material-ui/core/styles';
import { createStyles } from '@material-ui/core/styles';

const localStyles = makeStyles((theme) =>
  createStyles({
    optionText: {
      color: 'black',
      paddingLeft: '1vh',
    },
  })
);

const VerticalOptionWidget = ({
  content,
  switchSidebar,
  switchView,
}: {
  content: string;
  switchSidebar: any;
  switchView: any;
}) => {
  const style = localStyles();
  return (
    <Grid container item direction="column">
      <Heading title="Views" />b
      <Grid item>
        <TextViewButton />
        <span className={style.optionText}>Text</span>
      </Grid>
      <Grid item>
        <SpatialViewButton />
        <span className={style.optionText}>Concise</span>
      </Grid>
      <Grid item>
        <VisibilityButton onClick={switchSidebar} />
        <span className={style.optionText}>Expand</span>
      </Grid>
      <Grid item>
        <UndoButton />
        <span className={style.optionText}>Undo</span>
      </Grid>
      <Grid item>
        <RedoButton />
        <span className={style.optionText}>Redo</span>
      </Grid>
      <Grid item>
        <Tooltip title="Save">
          <IconButton
            aria-label="Save Action"
            color="primary"
            onClick={() => {
              ipcRenderer.send('save-content', content);
            }}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <span className={style.optionText}>Save</span>
      </Grid>
    </Grid>
  );
};

export { VerticalOptionWidget };
