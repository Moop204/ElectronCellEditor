import React, {
  useState,
  useEffect,
  ChangeEventHandler,
  ClickEventHandler,
} from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/Input';
import { IpcRendererEvent } from 'electron/main';
import { ipcRenderer } from 'electron';
import { useStyles } from '../style';
import { SubHeader } from '../SubHeader';
import { Heading } from '../Heading';
import { IChild, IProperties } from '../../types/IProperties';
import { Elements, strToElm } from '../../types/Elements';
import { ISearch, ISelect, ISelection, IUpdate } from '../../types/IQuery';

interface IPropertyAttribute {
  title: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const PropertyAttribute = (props: IPropertyAttribute) => {
  const { title, value, onChange } = props;
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
      <Button onClick={onClick}>{title}</Button>
    </Grid>
  );
};

const findElement = (elm: Elements, name: string) => {
  const select: ISearch = { index: null, name };
  const query: ISelect = { element: elm, select };
  switch (elm) {
    case Elements.component:
      ipcRenderer.send('select-element', query);
      break;
    default:
      console.log('Error: Not a valid element type');
  }
  console.log(`FIND ME THAT ELEMENT!!!!${elm}${name}`);
};

const ModelProperties = () => {
  const styles = useStyles();
  const [baseModel, setBaseModel] = useState<IProperties>();
  const [abstractModel, setAbstractModel] = useState<IProperties>();

  useEffect(() => {
    ipcRenderer.on(
      'res-get-element',
      (event: IpcRendererEvent, cellmlModel: IProperties) => {
        if (cellmlModel != null) {
          setAbstractModel(cellmlModel);
          if (!baseModel) {
            setBaseModel(cellmlModel);
          }
        }
      }
    );

    // Asks backend to convert current pointer into a specific element
    // Element MUST be correct type
    ipcRenderer.on('init-content', () => {
      ipcRenderer.send('get-element', Elements.model);
    });

    // ipcRenderer.on('update-content', () => {
    //   ipcRenderer.send('get-element', abstractModel.type);
    // });

    ipcRenderer.on(
      'res-select-element',
      (event: IpcRendererEvent, arg: ISelection) => {
        const { element, prop } = arg;
        console.log(prop);
        setAbstractModel(prop);
      }
    );
  }, []);

  // Before a file is loaded
  if (!abstractModel) {
    return (
      <Grid container item>
        <Heading title="Properties" />
        LOADING ...
      </Grid>
    );
  }

  // After a file is loaded
  const handleChange = (attrType: string, attrVal: string) => {
    const newAbstractModel = {
      ...abstractModel,
      attribute: { ...abstractModel?.attribute, [attrType]: attrVal },
    };
    const compName = abstractModel.attribute.name;
    setAbstractModel(newAbstractModel);
    ipcRenderer.send('update-attribute', {
      element: abstractModel.type,
      select: {
        name: compName,
        index: null,
      },
      parentSelect: null,
      attribute: attrType,
      value: attrVal,
    } as IUpdate);
    console.log(abstractModel);
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
              {Object.values(childrenType).map((attrType: any) => (
                <PropertyChild
                  title={attrType.name}
                  onClick={() => {
                    findElement(
                      Elements[parentKey as keyof typeof Elements],
                      attrType.name
                    );
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

export { ModelProperties };
