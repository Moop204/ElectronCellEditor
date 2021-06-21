import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";

const VisibilityButton = ({ onClick }: { onClick: any }) => {
  return (
    <Tooltip title="View Interface">
      <IconButton aria-label="View Interface" color="primary" onClick={onClick}>
        <VisibilityIcon />
      </IconButton>
    </Tooltip>
  );
};

export { VisibilityButton };
