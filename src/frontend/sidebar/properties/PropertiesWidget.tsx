import React, { useState, useEffect, FunctionComponent } from "react";
import Grid from "@material-ui/core/Grid";
import _ from "lodash";
import { Theme } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import { IProperties } from "../../../types/IProperties";
import { Elements, elmToStr } from "../../../types/Elements";
import { ISelection, IUpdate } from "../../../types/IQuery";
import { IpcRendererEvent } from "electron";
import { Paper, Typography } from "@material-ui/core";
import { AttributeWidget } from "./AttributeWidget";
import { capitaliseFirst } from "../../../utility/CapitaliseFirst";
import { UnitWidget } from "./UnitWidget";
import { ChildrenWidget } from "./children/ChildrenWidget";
import { AddChildrenWidget } from "./addChildren/AddChildrenWidget";
import { ElementHelp } from "../help/ElementHelp";

const localStyles = makeStyles(() =>
  createStyles({
    propertyWidget: {
      leftPadding: "5px",
    },
    subElementType: {
      display: "flex",
      justifyContent: "flex-end",
      fontSize: "1.2em",
    },
    plainText: {
      color: "black",
    },
    elementType: {
      display: "flex",
      justifyContent: "flex-end",
      fontSize: "1.8em",
    },
    properties: {
      height: "70vh",
      width: "100%",
      alignContent: "flex-start",
    },
  })
);

interface AttributeChange {
  type: Elements;
  name: string;
  attribute: string;
  attributeValue: string;
}

const PropertiesWidget: FunctionComponent = () => {
  const styles = localStyles();
  const [abstractModel, setAbstractModel] = useState<IProperties>();
  const [diffSet, setDiffSet] = useState<AttributeChange[]>([]);

  useEffect(() => {
    // Handles when it receives details about the selected element.
    window.api.receive(
      "res-get-element",
      (event: IpcRendererEvent, cellmlModel: IProperties) => {
        if (cellmlModel != null) {
          setAbstractModel(cellmlModel);
        }
      }
    );

    // Receives signal to start and asks backend to give contents
    // TODO: Prime candidate for removal. Role should be done in backend.
    // Asks backend to convert current pointer into a specific element
    // Element MUST be correct type
    window.api.receive("init-content", () => {
      window.api.send("get-element");
    });

    // Handles receiving updates to the abstract model
    window.api.receive(
      "res-select-element",
      (event: IpcRendererEvent, arg: ISelection) => {
        const { element, prop } = arg;
        setAbstractModel(prop);
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
    window.api.send("update-attribute", {
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
    window.api.send("get-element");
    return (
      <Grid item className={styles.plainText}>
        <Typography variant="h4" style={{ paddingLeft: "5px" }}>
          Properties
        </Typography>
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

    const change: AttributeChange = {
      type: abstractModel.type,
      attribute: attrType,
      attributeValue: attrVal,
      name: compName,
    };

    let newChangeFlag = true;
    for (let i = 0; i < diffSet.length; i++) {
      const existingChange = diffSet[i];
      if (existingChange.attribute === change.attribute) {
        diffSet[i] = change;
        newChangeFlag = false;
      }
    }
    if (newChangeFlag) diffSet.push(change);

    //    dbUpdateAttr(abstractModel.type, compName, attrType, attrVal);
    // console.log('MODEL PROPERTIES: Updated attribute');
  };

  const sendAttributeUpdate = () => {
    for (const { type, name, attribute, attributeValue } of diffSet) {
      dbUpdateAttr(type, name, attribute, attributeValue);
    }
    console.log(diffSet);
    setDiffSet([]);
  };

  return (
    <Paper className={styles.propertyWidget}>
      <Grid container item className={styles.properties} xs={12}>
        <Typography variant="h4" style={{ paddingLeft: "5px" }}>
          Properties
        </Typography>
        <Grid container item className={styles.plainText}>
          <Grid item className={styles.elementType} xs={2}>
            <Button
              onClick={() => {
                window.api.send("resetParent");
              }}
            >
              Parent
            </Button>
          </Grid>
          <Grid item className={styles.elementType} xs={10}>
            <Typography variant="h5" style={{ paddingRight: "5px" }}>
              {capitaliseFirst(elmToStr(abstractModel.type))}
            </Typography>
            <ElementHelp type={abstractModel.type} />
          </Grid>
          <AttributeWidget
            attribute={abstractModel.attribute}
            handleChange={handleChange}
          />
          <Button onClick={sendAttributeUpdate}>Update Attribute</Button>
          <UnitWidget unitMap={abstractModel.unit} />
          <ChildrenWidget
            abstractChildren={abstractModel.children}
            parentType={abstractModel.type}
          />
          <AddChildrenWidget
            element={abstractModel.type}
            name={abstractModel.attribute.name}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export { PropertiesWidget };
