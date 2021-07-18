import React, { useState, useEffect, FunctionComponent } from "react";
import Grid from "@material-ui/core/Grid";
import _ from "lodash";
import { Theme } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { IProperties } from "../../../types/IProperties";
import { Elements } from "../../../types/Elements";
import { ISelection } from "../../../types/IQuery";
import { IpcRendererEvent } from "electron";
import { Box, Paper, Typography } from "@material-ui/core";
import { AttributeWidget } from "./AttributeWidget";
import { UnitWidget } from "./UnitWidget";
import { ChildrenWidget } from "./children/ChildrenWidget";
import { AddChildrenWidget } from "./addChildren/AddChildrenWidget";
import { PropertiesWidgetTop } from "../component/PropertiesWidgetTop";

const localStyles = makeStyles(() =>
  createStyles({
    propertyWidget: {
      leftPadding: "1wv",
      rightPading: "1wv",
    },
    subElementType: {
      display: "flex",
      justifyContent: "flex-end",
      fontSize: "1.2em",
    },
    updateButton: {
      height: "50px",
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
      leftPadding: "1wv",
      rightPading: "1wv",

      //      alignContent: "flex-start",
    },
    updateAttribute: {
      marginTop: "2vh",
    },
    headerSeparator: {
      marginTop: "0.5vh",
    },
    childrenHeader: {
      marginRight: "8px",
    },
  })
);

interface AttributeChange {
  type: Elements;
  name: string;
  attribute: string;
  attributeValue: string;
  index: number;
}

const updateAttr = (changeSet: AttributeChange[]) => {
  const processUpdate = ({
    name,
    type,
    attribute,
    attributeValue,
    index,
  }: AttributeChange) => {
    return {
      element: type,
      select: {
        name: name,
        index: index,
      },
      attribute: attribute,
      value: attributeValue,
    };
  };

  window.api.send("update-attribute", changeSet.map(processUpdate));
};

const PropertiesWidget: FunctionComponent = () => {
  const styles = localStyles();
  const [abstractModel, setAbstractModel] = useState<IProperties>();
  const [diffSet, setDiffSet] = useState<AttributeChange[]>([]);

  const resetChanges = () => {
    setDiffSet([]);
  };

  useEffect(() => {
    const handleReceiveSelectedElement = (
      event: IpcRendererEvent,
      cellmlModel: IProperties
    ) => {
      if (cellmlModel != null) {
        setAbstractModel(cellmlModel);
      }
    };

    // Handles when it receives details about the selected element.
    window.api.receive("res-get-element", handleReceiveSelectedElement);

    const handleInitContent = () => {
      window.api.send("get-element");
    };

    // Receives signal to start and asks backend to give contents
    // TODO: Prime candidate for removal. Role should be done in backend.
    // Asks backend to convert current pointer into a specific element
    // Element MUST be correct type
    window.api.receive("init-content", handleInitContent);

    const handleUpdateAbstractModel = (
      event: IpcRendererEvent,
      arg: ISelection
    ) => {
      const { element, prop } = arg;
      setAbstractModel(prop);
    };

    // Handles receiving updates to the abstract model
    window.api.receive("res-select-element", handleUpdateAbstractModel);

    // ipcRenderer.on('update-content', () => {
    //   ipcRenderer.send('get-element', abstractModel.type);
    // });
    return () => {
      window.api.remove("res-select-element", handleUpdateAbstractModel);
      window.api.remove("init-content", handleInitContent);
    };
  }, []);

  // const dbUpdateAttr = _.debounce(
  //   (type: Elements, compName: string, attrType: string, attrVal: string) =>
  //     updateAttr(type, compName, attrType, attrVal),
  //   300
  // );

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

  if (abstractModel.type === Elements.none) {
    return (
      <Grid
        item
        className={styles.plainText + styles.propertyWidget}
        style={{ height: "100%" }}
      >
        <Typography variant="h4" style={{ paddingLeft: "5px" }}>
          Properties
        </Typography>
        <Typography variant="body1" style={{ paddingLeft: "5px" }}>
          No CellML element available to select. Please use a valid CellML file.
        </Typography>
      </Grid>
    );
  }

  // abstractModel.type
  // After a file is loaded
  const handleAttributeChange = (
    attrType: string,
    attrVal: string,
    index: number
  ) => {
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
      index: index,
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
    // Delay name changes last so that other changes are accurate

    const prioritySet = [];
    const postSet = [];

    for (const change of diffSet) {
      const { attribute } = change;
      if (attribute === "name") {
        postSet.push(change);
      } else {
        prioritySet.push(change);
      }
    }

    // Update the set
    const submitSet = [...postSet, ...prioritySet];
    updateAttr(submitSet);
    setDiffSet([]);
  };

  if (abstractModel.attribute.name) {
    return (
      <Box
        component="div"
        className={styles.propertyWidget}
        style={{ height: "95vh", overflowX: "hidden" }}
        overflow="scroll"
      >
        <Paper style={{ height: "95vh" }}>
          <Grid
            container
            className={styles.properties}
            spacing={1}
            justifyContent="flex-start"
          >
            <Typography variant="h4" style={{ paddingLeft: "5px" }}>
              Properties
            </Typography>
            <PropertiesWidgetTop type={abstractModel.type} />
            <AttributeWidget
              attribute={abstractModel.attribute}
              handleChange={handleAttributeChange}
              updateAttribute={sendAttributeUpdate}
            />

            {abstractModel.unit.length > 0 && (
              <UnitWidget
                unitMap={abstractModel.unit}
                parentName={abstractModel.attribute.name}
              />
            )}
            {Object.entries(abstractModel.children).length > 0 && (
              <span className={styles.childrenHeader}>
                <ChildrenWidget
                  abstractChildren={abstractModel.children}
                  parentType={abstractModel.type}
                  resetChanges={resetChanges}
                />
              </span>
            )}
            <AddChildrenWidget
              element={abstractModel.type}
              name={abstractModel.attribute.name}
            />
          </Grid>
        </Paper>
      </Box>
    );
  } else {
    return (
      <Grid
        container
        item
        className={styles.properties}
        xs={12}
        style={{ height: "60%" }}
      >
        <Box
          component="div"
          className={styles.propertyWidget}
          style={{ height: "100%", overflowX: "hidden" }}
          overflow="scroll"
        >
          <Paper style={{ height: "100%" }}>
            <Typography variant="h4" style={{ paddingLeft: "5px" }}>
              Properties
            </Typography>
            <PropertiesWidgetTop type={abstractModel.type} />
            <Grid container item className={styles.plainText}>
              <AttributeWidget
                attribute={abstractModel.attribute}
                handleChange={handleAttributeChange}
                updateAttribute={sendAttributeUpdate}
              />
            </Grid>
          </Paper>
        </Box>
      </Grid>
    );
  }
};

export { PropertiesWidget, updateAttr, AttributeChange };
