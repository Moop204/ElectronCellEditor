import React, { useState, useEffect, ChangeEventHandler } from 'react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from '../style';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import { SubHeader } from '../SubHeader';
import styled from 'styled-components';
import TextField from '@material-ui/core/Input';
import { Heading } from '../Heading';
import { ipcRenderer } from 'electron';
import { ModelProperties } from './ModelProperties';
import { ComponentProperties } from './ComponentProperties';
import { Elements } from '../../types/Elements';
import { ISelect } from '../../types/IQuery';

const ElementChildren = (props) => {
  const styles = useStyles();
  const { desc } = props;
  return (
    <Grid item container>
      <Button>X</Button> <p>[IMG]</p> <p> {desc} </p>
    </Grid>
  );
};

const Properties = () => {
  const styles = useStyles();
  const [curElm, setCurElm] = useState<Elements>(Elements.model);

  useEffect(() => {
    ipcRenderer.on('res-select-element', (event, selection: ISelect) => {
      setCurElm(Elements.component);
    });
  }, []);

  return (
    <Grid container item>
      <ModelProperties />
    </Grid>
  );
};

export { Properties };
