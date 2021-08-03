import Button from "@material-ui/core/Button";
import React, { FunctionComponent, MouseEventHandler, useState } from "react";
import ExtensionIcon from "@material-ui/icons/Extension";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import CropSquareIcon from "@material-ui/icons/CropSquare";
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory";
import { strToElm, Elements } from "../../../../types/Elements";
import {
  makeStyles,
  createStyles,
  Grid,
  Dialog,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { RulerIcon } from "../../../assets/RulerIcon";
import PowerIcon from "@material-ui/icons/Power";
import { ElementHelp } from "../../help/ElementHelp";
import { ConnectionEditForm } from "../addChildren/form/ConnectionEditForm";
import { DeleteButton } from "./DeleteButton";

interface IPropertyIcon {
  element: string;
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

const PropertyIcon: FunctionComponent<IPropertyIcon> = (props) => {
  const { element } = props;
  const style = useStyle();
  let icon;

  switch (element) {
    case "component":
      icon = <ExtensionIcon />;
      break;
    case "reset":
      icon = <RotateLeftIcon />;
      break;
    case "units":
      icon = <RulerIcon />;
      break;
    case "variable":
      icon = <ChangeHistoryIcon />;
      break;
    case "connection":
      icon = <PowerIcon />;
      break;

    default:
      icon = <div> |{element}| </div>;
  }
  return icon;
};

export { PropertyIcon };
