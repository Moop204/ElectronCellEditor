import React, { useState, useEffect, ChangeEventHandler } from 'react';

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
import { Elements, elmToStr, strToElm } from '../../types/Elements';
import { ISearch, ISelect, ISelection, IUpdate } from '../../types/IQuery';
import { capitaliseFirst } from '../../helper/utility';
// import { ChildrenWidget } from './model/ChildrenWidget';
import { AddChildSelect, Basic } from './forms/ComponentChildForm';
import { useCallback } from 'react';
import ExtensionIcon from '@material-ui/icons/Extension';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import CropSquareIcon from '@material-ui/icons/CropSquare';
import _ from 'underscore';
import { Tooltip } from '@material-ui/core';

interface IPropertyAttribute {
  title: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  updateAttribute: any;
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

const ModelProperties = () => {
  const styles = useStyles();
  const [baseModel, setBaseModel] = useState<IProperties>();
  const [abstractModel, setAbstractModel] = useState<IProperties>();

  useEffect(() => {
    ipcRenderer.on(
      'res-get-element',
      (event: IpcRendererEvent, cellmlModel: IProperties) => {
        console.log(`Setting ${cellmlModel}`);
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
      console.log(
        'MODELPROPERTIES: We are looking for detail about the model after opening a file'
      );
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

  const updateAttr = (type, compName, attrType, attrVal) => {
    ipcRenderer.send('update-attribute', {
      element: type,
      select: {
        name: compName,
        index: null,
      },
      parentSelect: null,
      attribute: attrType,
      value: attrVal,
    } as IUpdate);
  };

  const dbUpdateAttr = _.debounce(
    (type: Elements, compName: string, attrType: string, attrVal: string) =>
      updateAttr(type, compName, attrType, attrVal),
    300
  );

  // Before a file is loaded
  if (!abstractModel) {
    return (
      <Grid container item>
        <Heading title="Properties" />
        LOADING ...
      </Grid>
    );
  }

  // abstractModel.type
  // After a file is loaded
  const handleChange = (attrType: string, attrVal: string) => {
    const newAbstractModel = {
      ...abstractModel,
      attribute: { ...abstractModel?.attribute, [attrType]: attrVal },
    };
    const compName = abstractModel.attribute.name;
    setAbstractModel(newAbstractModel);
    dbUpdateAttr(abstractModel.type, compName, attrType, attrVal);
    console.log('MODEL PROPERTIES: Updated attribute');
  };

  const AttributesWidget = () => {
    return (
      <div>
        <SubHeader title="Attributes" />
        {Object.entries(abstractModel.attribute).map(([attrTitle, attrVal]) => (
          <PropertyAttribute
            title={attrTitle}
            value={attrVal}
            key={attrTitle}
            onChange={(e) => handleChange(attrTitle, e.target.value)}
          />
        ))}
      </div>
    );
  };

  const AddChildrenWidget = (prop: { element: Elements; name: string }) => {
    const { element, name } = prop;
    const addChild = (childElm: Elements, parent: Elements) => {
      return (
        <div key={name}>
          <AddChildSelect elm={childElm} parent={element} />
        </div>
      );
    };
    let children = [];
    switch (element) {
      case Elements.model:
        children = [Elements.component, Elements.units];
        break;
      case Elements.component:
        children = [Elements.reset, Elements.variable, Elements.component];
        break;
      default:
        return <div>No Children</div>;
    }
    return (
      <div>
        {children.map((elm) => {
          return addChild(elm, element);
        })}
      </div>
    );
  };

  interface IPropertyChild {
    title: string;
    onClick: ClickEventHandler<HTMLInputElement>;
    element: string;
  }

  const findElement = (elm: Elements, name: string) => {
    const select: ISearch = { index: null, name };
    const query: ISelect = { element: elm, select };
    console.log(select);
    console.log(query);
    switch (elm) {
      case Elements.component:
      case Elements.units:
        console.log('ModelProperties: Request Select-Element');
        ipcRenderer.send('select-element-A', query);
        break;
      default:
        console.log('Error: Not a valid element type');
    }
    console.log(`ModelProperties: Find!!!!${elm}${name}`);
  };

  const PropertyChild = (props: IPropertyChild) => {
    const { onClick, title, element } = props;

    let icon;
    switch (strToElm(element)) {
      case Elements.component:
        icon = <ExtensionIcon />;
        break;
      case Elements.reset:
        icon = <RotateLeftIcon />;
        break;
      case Elements.units:
        icon = <CropSquareIcon />;
      default:
        icon = <div> {element} </div>;
    }

    return (
      <Grid container item direction="row">
        {icon}
        <Button onClick={onClick}>{title}</Button>
      </Grid>
    );
  };

  const ChildrenWidget = () => {
    console.log(`Child widget: ${abstractModel.children}`);
    console.log(abstractModel.children);
    return (
      <div>
        <SubHeader title="Children" />

        {Object.entries(abstractModel.children).map(
          ([parentKey, childrenType]) => (
            <div key={parentKey}>
              <div className={styles.subElementType}>
                {capitaliseFirst(parentKey)}
              </div>

              {Object.values(childrenType).map((attrType: any) => (
                <span key={attrType.name}>
                  <PropertyChild
                    title={attrType.name}
                    onClick={() => {
                      findElement(
                        Elements[parentKey as keyof typeof Elements],
                        attrType.name
                      );
                    }}
                    element={parentKey}
                  />
                </span>
              ))}
            </div>
          )
        )}
      </div>
    );
  };
  console.log(`ModelProperties elementcheck: ${abstractModel.type}`);

  return (
    <Grid container item className={styles.properties}>
      <Heading title="Properties" />
      <Grid item className={styles.plainText}>
        <div className={styles.elementType}>
          {capitaliseFirst(elmToStr(abstractModel.type))}
        </div>
        <AttributesWidget />
        {/* <ChildrenWidget abstractChildren={abstractModel.children} /> */}
        <ChildrenWidget />
        <SubHeader title="Add Children" />
        <AddChildrenWidget
          element={abstractModel.type}
          name={abstractModel.attribute.name}
        />
      </Grid>
    </Grid>
  );
};

export { ModelProperties };
