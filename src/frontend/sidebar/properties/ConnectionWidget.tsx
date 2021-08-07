import {
  Button,
  createStyles,
  Dialog,
  DialogTitle,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { FunctionComponent, useState } from "react";
import { Elements } from "../../../types/Elements";
import { IChild } from "../../../types/IProperties";
import { ElementHelp } from "../help/ElementHelp";
import { RoundButton } from "../../component/RoundButton";
import { AddBadge } from "../../component/AddBadge";

import { PropertyIcon } from "./children/PropertyIcon";

interface IConnection {
  connection: IChild[];
}

const useStyle = makeStyles(() =>
  createStyles({
    buffer: {
      padding: "3vh",
    },
    button: {
      marginLeft: "2vh",
      marginRight: "7vh",
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

interface IConnectionButton {
  name: string;
  index: number;
}

const ConnectionButton: FunctionComponent<IConnectionButton> = ({
  name,
  index,
}) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const style = useStyle();
  return (
    <>
      <RoundButton>
        <ListItem button onClick={handleOpen} dense>
          <ListItemIcon>
            <AddBadge>
              <PropertyIcon element="connection" />
            </AddBadge>
          </ListItemIcon>
          <ListItemText primary={name} />
        </ListItem>
      </RoundButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Grid container item direction="row">
            <Grid item xs={10}>
              <Typography variant="h4" style={{ paddingLeft: "5px" }}>
                Edit Connection
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <ElementHelp type={Elements.unit} />
            </Grid>
          </Grid>
        </DialogTitle>
        <div className={style.buffer}>EDIT STUFF</div>
      </Dialog>
    </>
  );
};

const AddConnection: FunctionComponent = () => {
  return (
    <Grid container>
      <div> Component1 </div>
      <div> Variable1 </div>
      <div> Component2 </div>
      <div> Variable2 </div>
    </Grid>
  );
};

const ConnectionWidget: FunctionComponent<IConnection> = ({ connection }) => {
  return (
    <Grid container>
      <Typography variant="h4" style={{ paddingLeft: "5px" }}>
        Connection
      </Typography>
      {connection.map(({ name, index }) => (
        <ConnectionButton name={name} index={index} />
      ))}
      <div>Add Connection</div>
    </Grid>
  );
};

export { ConnectionWidget };
