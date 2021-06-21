import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const UndoButton = () => {
  return (
    <Tooltip title="Undo">
      <IconButton aria-label="Undo action" color="primary">
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
  );
};

export { UndoButton };
