import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const RedoButton = () => {
  return (
    <Tooltip title="Redo">
      <IconButton aria-label="Redo Action" color="primary">
        <ArrowForwardIcon />
      </IconButton>
    </Tooltip>
  );
};

export { RedoButton };
