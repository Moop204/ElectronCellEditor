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
import { AttributeWidget } from "./attributes/AttributeWidget";
import { UnitWidget } from "./UnitWidget";
import { ChildrenWidget } from "./children/ChildrenWidget";
import { AddChildrenWidget } from "./addChildren/AddChildrenWidget";
import { PropertiesWidgetTop } from "../component/PropertiesWidgetTop";
import { EmptyProperty } from "./content/EmptyProperty";
import { LoadingProperty } from "./content/LoadingProperty";
import { ConnectionWidget } from "./connection/ConnectionWidget";

const localStyles = makeStyles(() =>
  createStyles({
    propertyWidget: {
      paddingRight: "3px",
    },
    plainText: {
      color: "black",
    },

    properties: {
      height: "70vh",
      paddingLeft: "1wv",
      paddingRight: "1wv",
      alignContent: "start",
    },
    updateAttribute: {
      marginTop: "2vh",
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
      window.api.remove("res-get-element", handleReceiveSelectedElement);
    };
  }, []);

  // Before a file is loaded
  if (!abstractModel) {
    window.api.send("get-element");
    return <LoadingProperty />;
  }

  if (abstractModel.type === Elements.none) {
    return <EmptyProperty />;
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
    window.api.send("get-element");
  };

  const handleNonSave = () => setDiffSet([]);

  let propertyContent;
  if (
    abstractModel.attribute.name ||
    abstractModel.attribute.name !== undefined
  ) {
    propertyContent = (
      <Grid
        container
        className={styles.properties}
        spacing={1}
        justifyContent="flex-start"
      >
        {/* <Typography variant="h2" style={{ paddingLeft: "5px" }}>
          Properties
        </Typography> */}
        <PropertiesWidgetTop
          type={abstractModel.type}
          onClick={handleNonSave}
          resetChanges={handleNonSave}
        />
        <AttributeWidget
          attribute={abstractModel.attribute}
          handleChange={handleAttributeChange}
          updateAttribute={sendAttributeUpdate}
          parentType={abstractModel.type}
        />

        {abstractModel.unit.length > 0 && (
          <UnitWidget
            unitMap={abstractModel.unit}
            parentName={abstractModel.attribute.name}
          />
        )}

        {abstractModel.type === Elements.variable && (
          <ConnectionWidget connection={abstractModel.connection} />
        )}

        {Object.entries(abstractModel.children).length > 0 && (
          <ChildrenWidget
            abstractChildren={abstractModel.children}
            parentType={abstractModel.type}
            resetChanges={resetChanges}
          />
        )}
        <AddChildrenWidget
          element={abstractModel.type}
          name={abstractModel.attribute.name}
        />
      </Grid>
    );
  } else {
    propertyContent = (
      <Grid
        container
        className={styles.properties}
        spacing={1}
        justifyContent="flex-start"
      >
        <Typography variant="h2" style={{ paddingLeft: "5px" }}>
          Properties
        </Typography>
        <PropertiesWidgetTop
          type={abstractModel.type}
          onClick={handleNonSave}
          resetChanges={handleNonSave}
        />
        <Grid container item className={styles.plainText}>
          <AttributeWidget
            attribute={abstractModel.attribute}
            handleChange={handleAttributeChange}
            updateAttribute={sendAttributeUpdate}
            parentType={abstractModel.type}
          />
        </Grid>
      </Grid>
    );
  }

  return (
    <Box
      component="div"
      className={styles.propertyWidget}
      style={{ height: "95vh", overflowX: "hidden", paddingLeft: "5px" }}
      overflow="auto"
    >
      {propertyContent}
    </Box>
  );
};

export { PropertiesWidget, updateAttr, AttributeChange };
