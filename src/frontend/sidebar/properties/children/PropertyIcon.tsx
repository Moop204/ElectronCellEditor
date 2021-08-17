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
  Tooltip,
  Badge,
} from "@material-ui/core";
import { RulerIcon } from "../../../assets/RulerIcon";
import PowerIcon from "@material-ui/icons/Power";
import { ElementHelp } from "../../help/ElementHelp";
import { ConnectionEditForm } from "../addChildren/form/ConnectionEditForm";
import { DeleteButton } from "./DeleteButton";
import { SystemInternationalIcon } from "../../../assets/SystemeInternational";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ImportExportIcon from "@material-ui/icons/ImportExport";
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
  let icon;

  switch (element) {
    case "component":
      icon = <ExtensionIcon color="primary" />;
      break;
    case "imported-component":
      icon = (
        <Badge badgeContent={<ImportExportIcon />}>
          <ExtensionIcon color="primary" />
        </Badge>
      );
      break;
    case "reset":
      icon = <RotateLeftIcon color="primary" />;
      break;
    case "units":
      icon = <RulerIcon />;
      break;
    case "variable":
      icon = <ChangeHistoryIcon color="primary" />;
      break;
    case "connection":
      icon = <PowerIcon color="primary" />;
      break;
    case "unit":
      icon = <SystemInternationalIcon />;
      break;
    case "imported-units":
      icon = (
        <Badge badgeContent={<ImportExportIcon />}>
          <RulerIcon />
        </Badge>
      );
      break;
    case "model":
      icon = <DashboardIcon color="primary" />;
      break;
    default:
      icon = <div> |{element}| </div>;
  }
  return <Tooltip title={element}>{icon}</Tooltip>;
};

export { PropertyIcon };
