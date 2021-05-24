import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { IpcRendererEvent } from 'electron/main';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import { SubHeader } from '../../components/SubHeader';
import { Heading } from '../../components/Heading';
import { IProperties } from '../../../types/IProperties';
import { Elements, elmToStr, strToElm } from '../../../types/Elements';
import { ISelection, IUpdate } from '../../../types/IQuery';
import { capitaliseFirst } from '../../utils/utility';
import { AddChildrenWidget } from './AddChildrenWidget';
import { AttributeWidget } from './AttributeWidget';
import { ChildrenWidget } from './ChildrenWidget';

const localStyles = makeStyles((theme: Theme) =>
  createStyles({
    subElementType: {
      display: 'flex',
      justifyContent: 'flex-end',
      fontSize: '1.2em',
    },
    plainText: {
      color: 'black',
    },
    elementType: {
      display: 'flex',
      justifyContent: 'flex-end',
      fontSize: '1.8em',
    },
    properties: {
      height: '70vh',
      width: '100%',
      alignContent: 'flex-start',
    },
  })
);

const PropertiesWidget = () => {
  const styles = localStyles();
  const [abstractModel, setAbstractModel] = useState<IProperties>();

  useEffect(() => {
    // Handles when it receives details about the selected element.
    ipcRenderer.on(
      'res-get-element',
      (event: IpcRendererEvent, cellmlModel: IProperties) => {
        if (cellmlModel != null) {
          if (
            !(
              cellmlModel.type &&
              cellmlModel.attribute &&
              cellmlModel.children &&
              cellmlModel.parent
            )
          ) {
            console.log(
              'ABSTRACTMODEL: Failed to contain requisite properties upon res-get-element'
            );
          }
          setAbstractModel(cellmlModel);
        }
      }
    );

    // Receives signal to start and asks backend to give contents
    // TODO: Prime candidate for removal. Role should be done in backend.
    // Asks backend to convert current pointer into a specific element
    // Element MUST be correct type
    ipcRenderer.on('init-content', () => {
      console.log(
        'MODELPROPERTIES: We are looking for detail about the model after opening a file'
      );
      ipcRenderer.send('get-element');
    });

    // Handles receiving updates to the abstract model
    ipcRenderer.on(
      'res-select-element',
      (event: IpcRendererEvent, arg: ISelection) => {
        const { element, prop } = arg;
        if (!(prop.type && prop.attribute && prop.children && prop.parent)) {
          console.log(
            'ABSTRACTMODEL: Failed to contain requisite properties upon res-select-element'
          );
        }

        setAbstractModel(prop);
        console.log('Set ABSTRACT MODEL AS');
        console.log(prop);
      }
    );

    // ipcRenderer.on('update-content', () => {
    //   ipcRenderer.send('get-element', abstractModel.type);
    // });
  }, []);

  const updateAttr = (
    type: Elements,
    compName: string,
    attrType: string,
    attrVal: string
  ) => {
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
      <Grid item>
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
    if (
      !(
        newAbstractModel.type &&
        newAbstractModel.attribute &&
        newAbstractModel.children &&
        newAbstractModel.parent
      )
    ) {
      console.log(
        'ABSTRACTMODEL: Failed to contain requisite properties upon handling change'
      );
    }

    setAbstractModel(newAbstractModel);
    dbUpdateAttr(abstractModel.type, compName, attrType, attrVal);
    console.log('MODEL PROPERTIES: Updated attribute');
  };

  return (
    <Grid container item className={styles.properties}>
      <Heading title="Properties" />
      <Grid item className={styles.plainText}>
        <div className={styles.elementType}>
          <Button>Parent</Button>
          {capitaliseFirst(elmToStr(abstractModel.type))}
        </div>
        <AttributeWidget
          attribute={abstractModel.attribute}
          handleChange={handleChange}
        />
        <ChildrenWidget
          abstractChildren={abstractModel.children}
          parentType={abstractModel.type}
        />
        <SubHeader title="Add Children" />
        <AddChildrenWidget
          element={abstractModel.type}
          name={abstractModel.attribute.name}
        />
      </Grid>
    </Grid>
  );
};

export { PropertiesWidget };
