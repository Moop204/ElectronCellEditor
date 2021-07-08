import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import React, { useState, ChangeEventHandler, FunctionComponent } from "react";
import { Elements, elmToStr } from "../../../../types/Elements";
//import { ElementHelp } from "../../components/helper/ElementHelp";
import Grid from "@material-ui/core/Grid";
import { ComponentChildForm } from "./form/ComponentChildForm";
import { ResetChildForm } from "./form/ResetChildForm";
import { UnitsChildForm } from "./form/UnitsChildForm";
import { VariableChildForm } from "./form/VariableChildForm";
import { UnitChildForm } from "./form/UnitChildForm";
import { ElementHelp } from "../../help/ElementHelp";

interface IAddChild {
  childElement: Elements;
  parentElement: Elements;
  parentName: string;
}

const ElementForm: FunctionComponent<IAddChild> = ({
  childElement,
  parentElement,
  parentName,
}) => {
  // Controls it popping or not
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log(`ComponentChildForm elementcheck: ${parentElement}`);

  let form;
  switch (childElement) {
    case Elements.component:
      form = (
        <ComponentChildForm
          parent={parentElement}
          parentName={parentName}
          handleClose={handleClose}
        />
      );
      break;
    case Elements.units:
      form = (
        <UnitsChildForm
          parent={parentElement}
          parentName={parentName}
          handleClose={handleClose}
        />
      );
      break;
    case Elements.variable:
      form = (
        <VariableChildForm
          parent={parentElement}
          parentName={parentName}
          handleClose={handleClose}
        ></VariableChildForm>
      );
      break;
    case Elements.reset:
      form = (
        <ResetChildForm
          parent={parentElement}
          parentName={parentName}
          handleClose={handleClose}
        />
      );
      break;
    case Elements.unit:
      form = (
        <UnitChildForm
          parent={parentElement}
          parentName={parentName}
          handleClose={handleClose}
        />
      );
      break;
    default:
  }

  return (
    <div>
      <Button variant="outlined" fullWidth onClick={handleClickOpen}>
        + {elmToStr(childElement)}
      </Button>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
        fullWidth
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
        <DialogContent>{form}</DialogContent>
      </Dialog>
    </div>
  );
};

export { ElementForm };
