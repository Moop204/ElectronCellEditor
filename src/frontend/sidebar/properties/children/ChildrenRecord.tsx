import {
  makeStyles,
  createStyles,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListItemIcon,
  Button,
} from "@material-ui/core";
import React, { FunctionComponent, MouseEventHandler, useState } from "react";
import { strToElm } from "../../../../types/Elements";
import { DeleteButton } from "./DeleteButton";
import { PropertyIcon } from "./PropertyIcon";
import { RoundButton } from "../../../component/RoundButton";

interface IChildrenRecord {
  title: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  element: string;
  index: number;
  parentName?: string;
}

const useStyle = makeStyles(() =>
  createStyles({
    button: {
      marginTop: "0.5vh",
      paddingLeft: "3px",
      //marginLeft: "1vw",
      paddingRight: "0px",
      maxWidth: "16vw",
    },
    root: {
      flexGrow: 1,
    },
    buttonText: {
      paddingLeft: "8px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      justifyContent: "left",
      textAlign: "justify",
      textTransform: "none",
    },
  })
);

const ChildrenRecord: FunctionComponent<IChildrenRecord> = ({
  onClick,
  title,
  element,
  index,
  parentName,
}) => {
  return (
    <RoundButton>
      <ListItem
        button
        onClick={onClick}
        dense
        style={{ backgroundColor: "default" }}
      >
        <ListItemIcon>
          <PropertyIcon element={element} />
        </ListItemIcon>
        <ListItemText primary={title} style={{ textOverflow: "ellipsis" }} />
        <ListItemSecondaryAction>
          <DeleteButton
            elementType={strToElm(element)}
            name={title}
            index={index}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </RoundButton>
  );
};

export { ChildrenRecord };
