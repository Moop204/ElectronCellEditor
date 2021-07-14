import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import React, { FunctionComponent, useState } from "react";
import { Elements, elmToStr, strToElm } from "../../../../types/Elements";

interface IDeleteButton {
  elementType: Elements;
  name: string;
  index: number;
}

const DeleteButton: FunctionComponent<IDeleteButton> = ({
  elementType,
  name,
  index,
}) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  return (
    <span>
      <Button variant="outlined" onClick={handleOpen}>
        X
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1" style={{ paddingLeft: "5px" }}>
            {`Are you sure you want to delete ${elmToStr(elementType)} ${
              name ? name : index
            }?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              handleClose();
              window.api.send("delete-element", {
                element: elementType,
                select: { name, index },
              });
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

export { DeleteButton };
