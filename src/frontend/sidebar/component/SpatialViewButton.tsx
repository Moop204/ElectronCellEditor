import Tooltip from "@material-ui/core/Tooltip";
import React, { FunctionComponent } from "react";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import StorageIcon from "@material-ui/icons/Storage";
import { Typography } from "@material-ui/core";
import { textStyle } from "./textStyle";

interface ISpatialViewButton {
  onClick: any;
  expanded: boolean;
}

const SpatialViewButton: FunctionComponent<ISpatialViewButton> = ({
  onClick,
  expanded,
}) => {
  const style = textStyle();
  return (
    <div>
      <Tooltip title="Concise View">
        <Link to="/concise">
          <IconButton
            aria-label="Concise View"
            color="primary"
            onClick={onClick}
          >
            <StorageIcon />
          </IconButton>
        </Link>
      </Tooltip>
    </div>
  );
};

export { SpatialViewButton };
