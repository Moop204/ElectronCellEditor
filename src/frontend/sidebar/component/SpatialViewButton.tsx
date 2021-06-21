import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import StorageIcon from "@material-ui/icons/Storage";

const SpatialViewButton = ({ onClick }: { onClick: any }) => {
  return (
    <Tooltip title="Concise View">
      <Link to="/spatial">
        <IconButton aria-label="Concise View" color="primary">
          <StorageIcon />
        </IconButton>
      </Link>
    </Tooltip>
  );
};

export { SpatialViewButton };
