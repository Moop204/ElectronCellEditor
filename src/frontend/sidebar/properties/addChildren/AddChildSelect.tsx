import {
  Badge,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, { FunctionComponent, useState } from "react";
import { Elements, elmToStr, strToElm } from "../../../../types/Elements";
import { ElementHelp } from "../../help/ElementHelp";
import { PropertyIcon } from "../children/PropertyIcon";
import { ElementForm } from "./ElementForm";
import AddIcon from "@material-ui/icons/Add";
interface IAddChild {
  childElement: Elements;
  parentElement: Elements;
  parentName: string;
}

// Describes children that user can choose to add
const AddChildSelect: FunctionComponent<IAddChild> = ({
  childElement,
  parentElement,
  parentName,
}) => {
  console.log(`ComponentChildForm elementcheck: ${parentElement}`);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    console.log("I GOT HERE ");
  };

  return (
    <>
      <ListItem
        button
        onClick={handleClickOpen}
        style={{ alignItems: "center" }}
      >
        <ListItemIcon>
          <Badge
            color="error"
            style={{ backgroundColor: "" }}
            overlap="circle"
            badgeContent="+"
          >
            <PropertyIcon element={elmToStr(childElement)} />
          </Badge>
        </ListItemIcon>
        <ListItemText primary={elmToStr(childElement)} />
        <ListItemSecondaryAction>
          <ElementHelp type={childElement} />
        </ListItemSecondaryAction>
      </ListItem>
      <Dialog
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          <Grid container>
            <Grid item xs={10}>
              Add {elmToStr(childElement)} as child of {elmToStr(parentElement)}
            </Grid>
            <Grid item xs={2}>
              <ElementHelp type={childElement} />
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <ElementForm
            childElement={childElement}
            parentElement={parentElement}
            parentName={parentName}
            handleClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export { AddChildSelect };
