import Tooltip from "@material-ui/core/Tooltip";
import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";

const NewFileButton = () => {
  const [open, setOpen] = useState(false);
  const handleAccept = () => {
    setOpen(false);
    window.api.send("new-file");
  };
  const handleReject = () => {
    setOpen(false);
  };
  const handleOpenDialog = () => setOpen(true);
  return (
    <>
      <Tooltip title="New File">
        <IconButton color="primary" onClick={handleOpenDialog}>
          <NoteAddIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open}>
        <DialogTitle>
          <Typography variant="h6">
            Are you sure you want to make a new file?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Making a new file will overwrite the current file. Are you sure you
            want to do this?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReject}>No</Button>
          <Button onClick={handleAccept}>Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { NewFileButton };
