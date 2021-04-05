import React, { useState, useEffect, ChangeEventHandler } from 'react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from './style';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import { SubHeader } from './SubHeader';
import styled from 'styled-components';
import TextField from '@material-ui/core/Input';
import { Heading } from './Heading';
import { ipcRenderer } from 'electron';
import { ModelProperties } from './ModelProperties';
import { ComponentProperties } from './ComponentProperties';
import { Elements } from './Elements';
import { ISelect } from '../types/IQuery';

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
      console.log('Changed curelm');
      setCurElm(Elements.component);
    });

    // ipcRenderer.on('reply-selected-name', (event, arg: AttrDesc[]) => {
    //   let newAttr: AttrDesc[] = arg.map((obj, idNo) => {
    //     const title = obj.title;
    //     const val = obj.value;
    //     return { id: idNo.toString(), title: title, value: val };
    //   });
    //   setAttr(newAttr);
    // });

    // ipcRenderer.on('initiate-properties', (event, arg) => {
    //   console.log('INITIATE TIMEEEEE');
    //   ipcRenderer.send('selected-name');
    // });
  }, []);

  return (
    <Grid container item>
      <ModelProperties />
    </Grid>
  );

  // switch (curElm) {
  //   case Elements.model:
  //     return (
  //       <Grid container item>
  //         <ModelProperties />
  //       </Grid>
  //     );
  //   case Elements.component:
  //     return (
  //       <Grid container item>
  //         COMPONENNNT
  //         <ComponentProperties />
  //       </Grid>
  //     );
  //   default:
  //     return (
  //       <Grid container item>
  //         ERROR: NO VALID ELEMENT ASSIGNED
  //       </Grid>
  //     );
  // }
};

export { Properties };
