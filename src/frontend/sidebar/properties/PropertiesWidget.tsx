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
import { Box, Paper, Typography } from "@material-ui/core";
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

const updateAttr = (changeSet: AttributeChange[]) => {
  const processUpdate = ({
    name,
    type,
    attribute,
    attributeValue,
  }: AttributeChange): IUpdate => {
    return {
      element: type,
      select: {
        name: name,
        index: null,
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
      <Grid item className={styles.plainText} style={{ height: "60%" }}>
        <Paper className={styles.propertyWidget} style={{ height: "100%" }}>
          <Typography variant="h4" style={{ paddingLeft: "5px" }}>
            Properties
          </Typography>
          <Typography variant="body1" style={{ paddingLeft: "5px" }}>
            No CellML element available to select. Please use a valid CellML
            file.
          </Typography>
        </Paper>
      </Grid>
    );
  }

  // abstractModel.type
  // After a file is loaded
  const handleAttributeChange = (attrType: string, attrVal: string) => {
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
    console.log("DIFFSET BEFORE SENDING");
    console.log(diffSet);
    const submitSet = [...prioritySet, ...postSet];
    updateAttr(submitSet);
    setDiffSet([]);
  };

  console.log(abstractModel);
  if (abstractModel.attribute.name) {
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
            <Grid container item className={styles.plainText}>
              <Grid item className={styles.elementType} xs={2}>
                <Button
                  onClick={() => {
                    resetChanges();
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
                handleChange={handleAttributeChange}
              />
              <Button onClick={sendAttributeUpdate}>Update Attribute</Button>
              <UnitWidget
                unitMap={abstractModel.unit}
                parentName={abstractModel.attribute.name}
              />
              <ChildrenWidget
                abstractChildren={abstractModel.children}
                parentType={abstractModel.type}
                resetChanges={resetChanges}
              />
              <AddChildrenWidget
                element={abstractModel.type}
                name={abstractModel.attribute.name}
              />
            </Grid>
          </Paper>
        </Box>
      </Grid>
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
                handleChange={handleAttributeChange}
              />
              <Button onClick={sendAttributeUpdate}>Update Attribute</Button>
            </Grid>
          </Paper>
        </Box>
      </Grid>
    );
  }
};

export { PropertiesWidget, updateAttr };
