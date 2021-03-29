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

const ElementChildren = (props) => {
  const styles = useStyles();
  const { desc } = props;
  return (
    <Grid item container>
      <Button>X</Button> <p>[IMG]</p> <p> {desc} </p>
    </Grid>
  );
};

interface AttrDesc {
  id: string;
  title: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const PropertyAttribute = (props: AttrDesc) => {
  const { id, title, value, onChange } = props;
  /*
  const AttributeLabel = styled.p`
    padding-right: 1rem;
  `;
  */

  return (
    <Grid container item direction="row">
      <InputLabel>{title}</InputLabel>
      <TextField id={id} value={value} onChange={onChange} />
    </Grid>
  );
};

const Properties = () => {
  const styles = useStyles();
  const [attr, setAttr] = useState<AttrDesc[]>([]);

  
  useEffect(() => {
    ipcRenderer.on('reply-selected-name', (event, arg: AttrDesc[]) => {
      let newAttr: AttrDesc[] = arg.map((obj, idNo) => {
        const title = obj.title;
        const val = obj.value;
        return { id: idNo.toString(), title: title, value: val };
      });
      setAttr(newAttr);
    });

    ipcRenderer.on('initiate-properties', (event, arg) => {
      console.log('INITIATE TIMEEEEE');
      ipcRenderer.send('selected-name');
    });
  }, []);

  const children = [
    'width',
    'length',
    'perimeter',
    'perimeter=2*(width+length)',
  ];

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    let newAttr = [...attr];
    const id: number = parseInt(event.target.id);
    newAttr[id].value = event.target.value;
    setAttr(newAttr);
  };

  let id: number = 0;
  return (
    <Grid container item>
      <Heading title="Properties" />
      <Grid item md={12} className={styles.plainText}>
        <SubHeader title="Attributes" />
        {attr.map((elm, key) => {
          const { title, value } = elm;
          const readId = id;
          id++;
          return (
            <PropertyAttribute
              id={readId.toString()}
              title={title}
              value={value}
              key={key}
              onChange={handleOnChange}
            />
          );
        })}
        <SubHeader title="Children" />
        {children.map((child, key) => {
          return <ElementChildren desc={child} key={key} />;
        })}
      </Grid>
    </Grid>
  );
};

export { Properties };
