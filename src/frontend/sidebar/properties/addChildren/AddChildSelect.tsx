import {
  Badge,
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, { FunctionComponent, useState } from "react";
import { Elements, elmToStr, strToElm } from "../../../../types/Elements";
import { ElementHelp } from "../../help/ElementHelp";
import { PropertyIcon } from "../children/PropertyIcon";
import { ElementForm } from "./ElementForm";
import { AddBadge } from "./../../../component/AddBadge";
import { RoundButton } from "../../../../frontend/component/RoundButton";
interface IAddChild {
  childElement: Elements;
  parentElement: Elements;
  parentName: string;
}

const useStyle = makeStyles(() =>
  createStyles({
    addButton: {
      paddingTop: "2px",
      paddingBottom: "2px",
      alignItems: "center",
    },
  })
);

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
  const style = useStyle();
  return (
    <RoundButton>
      <ListItem button onClick={handleClickOpen} className={style.addButton}>
        <ListItemIcon>
          <AddBadge>
            <PropertyIcon element={elmToStr(childElement)} />
          </AddBadge>
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
    </RoundButton>
  );
};

export { AddChildSelect };
