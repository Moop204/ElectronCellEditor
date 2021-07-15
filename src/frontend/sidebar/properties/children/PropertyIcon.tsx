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
import { DeleteButton } from "./DeleteChildren";

interface IPropertyIcon {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  element: string;
  index: number;
  parentName?: string;
}

const useStyle = makeStyles(() =>
  createStyles({
    button: {
      marginTop: "0.5vh",
      //marginLeft: "1vw",
    },
  })
);

const PropertyIcon: FunctionComponent<IPropertyIcon> = (props) => {
  const { onClick, title, element, index, parentName } = props;
  const style = useStyle();
  let icon;

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

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

  if (element === "connection") {
    return (
      <Grid item container xs={10}>
        <Grid item xs={10}>
          <Button
            variant="outlined"
            onClick={handleOpen}
            fullWidth
            className={style.button}
          >
            <Grid container>
              <Grid item xs={2}>
                {icon}
              </Grid>
              <Grid item xs={10}>
                {title}
              </Grid>
            </Grid>
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            onClick={() => {
              window.api.send("update-attribute", [
                {
                  element: Elements.variable,
                  select: { name: title, index: index },
                  attribute: "connection",
                  value: parentName,
                },
              ]);
            }}
          >
            X
          </Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container direction="row" key={element + title}>
      <Grid item xs={11} className={style.button}>
        <Button variant="outlined" onClick={onClick} fullWidth>
          <Grid container>
            <Grid item xs={1}>
              {icon}
            </Grid>
            <Grid item xs={10}>
              {title}
            </Grid>
          </Grid>
        </Button>
      </Grid>
      <Grid item xs={1} className={style.button}>
        <DeleteButton
          elementType={strToElm(element)}
          name={title}
          index={index}
        />
      </Grid>
    </Grid>
  );
};

export default PropertyIcon;
