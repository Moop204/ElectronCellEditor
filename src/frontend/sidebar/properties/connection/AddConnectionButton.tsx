import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  Grid,
  Typography,
  DialogContent,
} from "@material-ui/core";
import { AddBadge } from "../../../component/AddBadge";
import { RoundButton } from "../../../component/RoundButton";
import { ElementHelp } from "../../help/ElementHelp";
import React, { FunctionComponent, useState } from "react";
import { Elements } from "../../../../types/Elements";
import { PropertyIcon } from "../children/PropertyIcon";
import { AddConnectionForm } from "./AddConnectionForm";

// Button that adds a Connection from the GUI
const AddConnectionButton: FunctionComponent = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <RoundButton>
        <ListItem button onClick={handleOpen} dense>
          <ListItemIcon>
            <AddBadge>
              <PropertyIcon element="connection" />
            </AddBadge>
          </ListItemIcon>
          <ListItemText primary="Connection" />
        </ListItem>
      </RoundButton>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        style={{ padding: "8px" }}
      >
        <DialogTitle>
          <Grid container item direction="row">
            <Grid item xs={10}>
              <Typography variant="h4" style={{ paddingLeft: "5px" }}>
                Add Connection
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <ElementHelp type={Elements.connection} />
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent style={{}}>
          <AddConnectionForm
            connection={{
              component1: "",
              component2: "",
              variable1: "",
              variable2: "",
            }}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export { AddConnectionButton };
