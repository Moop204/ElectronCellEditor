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
import { useState } from 'react';
import { useEffect } from 'react';

const OptionWidget = ({
  content,
  switchSidebar,
  switchView,
}: {
  content: string;
  switchSidebar: any;
  switchView: any;
}) => {
  const [baseContent, setBaseContent] = useState('');
  useEffect(() => {
    setBaseContent(content);
  }, []);

  return (
    <Grid container item>
      <Heading title="Views" />
      <Grid container item>
        <Grid item md={2}>
          <TextViewButton onClick={switchView} />
        </Grid>
        <Grid item md={2}>
          <SpatialViewButton onClick={switchView} />
        </Grid>
        <Grid item md={2}>
          <VisibilityButton onClick={switchSidebar} />
        </Grid>
        <Grid item md={2}>
          <UndoButton />
        </Grid>
        <Grid item md={2}>
          <RedoButton />
        </Grid>
        <Grid item md={2}>
          <Tooltip title="Redo">
            <IconButton
              aria-label="Redo Action"
              color={baseContent === content ? 'primary' : 'secondary'}
              onClick={() => {
                ipcRenderer.send('save-content', content);
                setBaseContent(content);
              }}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { OptionWidget };
