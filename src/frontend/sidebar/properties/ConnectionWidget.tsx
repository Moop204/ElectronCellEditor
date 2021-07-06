import {
  Button,
  createStyles,
  Dialog,
  DialogTitle,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { FunctionComponent, useState } from "react";
import { Elements } from "../../../types/Elements";
import { IChild } from "../../../types/IProperties";
import { ElementHelp } from "../help/ElementHelp";
import { UnitEditForm } from "./addChildren/form/UnitEditForm";

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
    <Grid item container xs={12}>
      <Button
        variant="outlined"
        onClick={handleOpen}
        fullWidth
        className={style.button}
      >
        {name}
      </Button>
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
    </Grid>
  );
};

const ConnectionWidget: FunctionComponent<IConnection> = ({ connection }) => {
  return (
    <Grid container>
      {connection.map(({ name, index }) => (
        <ConnectionButton name={name} index={index} />
      ))}
    </Grid>
  );
};

export { ConnectionWidget };
