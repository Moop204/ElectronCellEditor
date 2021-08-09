import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { RoundButton } from "../../../component/RoundButton";
import React, { FunctionComponent, useState } from "react";
import { Elements } from "../../../../types/Elements";
import { DeleteButton } from "../children/DeleteButton";
import { PropertyIcon } from "../children/PropertyIcon";

interface IConnectionButton {
  name: string;
  index: number;
}

// React Component of a Connection
// Displays an item of Connection in a list
const ConnectionRecordButton: FunctionComponent<IConnectionButton> = ({
  name,
  index,
}) => {
  return (
    <>
      <RoundButton>
        <ListItem button dense>
          <ListItemIcon>
            <PropertyIcon element="connection" />
          </ListItemIcon>
          <ListItemText primary={name} />
          <ListItemSecondaryAction>
            <DeleteButton
              elementType={Elements.connection}
              name={name}
              index={index}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </RoundButton>
    </>
  );
};

export { ConnectionRecordButton };
