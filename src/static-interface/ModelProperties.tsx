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
import { IModelProperties } from '../types/IModelProperties';

enum Elements { 
    Model, 
    Component, 
    Units, 
    Reset, // TODO: Remove maybe? 
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
        <TextField value={value} onChange={onChange} />
      </Grid>
    );
  };
};

const ModelProperties = () => {
  const styles = useStyles();
  const [abstractModel, setAbstractModel] = useState<IModelProperties>();
  
  
  useEffect(() => {
    ipcRenderer.on('reply-selected-model', (event, arg: IModelProperties) => {
        setAbstractModel(arg);
    })
    ipcRenderer.on('selected-model', (event, arg) => {
        ipcRenderer
    })
  }, []);


//   const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
//     let newAttr = [...attr];
//     const id: number = parseInt(event.target.id);
//     newAttr[id].value = event.target.value;
//     setAttr(newAttr);
//   };

//   <PropertyAttribute
//   id={readId.toString()}
//   title={title}
//   value={value}
//   key={key}
//   onChange={handleOnChange}
// />
return (
    <Grid container item>
      <Heading title="Properties" />
      <Grid item md={12} className={styles.plainText}>
        <SubHeader title="Attributes" />
        {abstractModel && (
          Object.keys(abstractModel.attribute).map( (key)=> {
            return (
              <PropertyAttribute title={key} value={abstractModel.attribute[key]}/>
            )}
          )
        )}
        {/* <SubHeader title="Children" />
        {children.map((child, key) => {
          return <ElementChildren desc={child} key={key} />;
        })} */}
      </Grid>
    </Grid>
  );
};

export { ModelProperties };
