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
import PowerIcon from "@material-ui/icons/Power";
import { ElementHelp } from "../../help/ElementHelp";

interface IPropertyIcon {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  element: string;
  index: number;
}

const useStyle = makeStyles(() =>
  createStyles({
    button: {
      margin: "0.5vh",
      marginLeft: "2vw",
    },
    buffer: {
      padding: "3vh",
    },
  })
);

const PropertyIcon: FunctionComponent<IPropertyIcon> = (props) => {
  const { onClick, title, element, index } = props;
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
      icon = <CropSquareIcon />;
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
      <Grid item container xs={12}>
        <Button
          variant="outlined"
          onClick={handleOpen}
          fullWidth
          className={style.button}
        >
          {icon}
          {title}
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            <Grid container item direction="row">
              <Grid item xs={10}>
                <Typography variant="h4" style={{ paddingLeft: "5px" }}>
                  Edit Connection
                </Typography>
              </Grid>
            </Grid>
          </DialogTitle>
          <div className={style.buffer}>EDIT STUFF</div>
        </Dialog>
      </Grid>
    );
  }

  return (
    <Grid item xs={10}>
      <Button
        variant="outlined"
        onClick={onClick}
        className={style.button}
        fullWidth
      >
        {icon}
        {title}
      </Button>
    </Grid>
  );
};

export default PropertyIcon;
