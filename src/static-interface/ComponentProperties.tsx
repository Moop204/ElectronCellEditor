import React, {
  useState,
  useEffect,
  ChangeEventHandler,
  ClickEventHandler,
} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import styled from 'styled-components';
import TextField from '@material-ui/core/Input';
import { ipcRenderer } from 'electron';
import { useStyles } from './style';
import { SubHeader } from './SubHeader';
import { Heading } from './Heading';
import { IModelProperties, IUnits } from '../types/IModelProperties';
import { Elements } from './Elements';
import { IComponentProperties } from '../types/IComponentProperties';

interface IPropertyAttribute {
  title: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const PropertyAttribute = (props: IPropertyAttribute) => {
  const { title, value, onChange } = props;
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

interface IPropertyChild {
  title: string;
  onClick: ClickEventHandler<HTMLInputElement>;
}

const PropertyChild = (props: IPropertyChild) => {
  const { onClick, title } = props;

  return (
    <Grid container item direction="row">
      <Button>{title}</Button>
    </Grid>
  );
};

const ComponentProperties = () => {
  const styles = useStyles();
  const [abstractModel, setAbstractModel] = useState<IComponentProperties>();

  useEffect(() => {
    ipcRenderer.on('select-element', (event, arg: IComponentProperties) => {
      setAbstractModel(arg);
    });
  }, []);

  if (!abstractModel) {
    return (
      <Grid container item>
        <Heading title="Properties" />
        LOADING ...
      </Grid>
    );
  }

  const handleChange = (attrType: string, attrVal: string) => {
    const newAbstractModel = {
      ...abstractModel,
      attribute: { ...abstractModel?.attribute, [attrType]: attrVal },
    };
    setAbstractModel(newAbstractModel);
  };

  const findElement = (elm: Elements, name: string) => {
    switch (elm) {
      case Elements.component:
        ipcRenderer.send('find-component', name);
        break;
      default:
        console.log('Error: Not a valid element type');
    }
  };

  return (
    <Grid container item>
      <Heading title="Properties" />
      <Grid item md={12} className={styles.plainText}>
        <SubHeader title="Attributes" />
        {Object.entries(abstractModel.attribute).map(([attrTitle, attrVal]) => (
          <PropertyAttribute
            title={attrTitle}
            value={attrVal}
            key={attrTitle}
            onChange={(e) => handleChange(attrTitle, e.target.value)}
          />
        ))}
        {Object.entries(abstractModel.children).map(
          ([parentKey, childrenType]) => (
            <div key={parentKey}>
              <SubHeader title={parentKey} />
              {Object.values(childrenType).map((attrType) => (
                <PropertyChild
                  title={attrType.name}
                  onClick={() => {
                    findElement(Elements[parentKey], attrType.name);
                  }}
                  key={attrType.name}
                />
              ))}
            </div>
          )
        )}
      </Grid>
    </Grid>
  );
};

export { ComponentProperties };
