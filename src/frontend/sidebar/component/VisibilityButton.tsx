import Tooltip from "@material-ui/core/Tooltip";
import React, { FunctionComponent } from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Typography, IconButton } from "@material-ui/core";
import { textStyle } from "./textStyle";

interface IVisibilityButton {
  onClick: any;
  expanded: boolean;
}

const VisibilityButton: FunctionComponent<IVisibilityButton> = ({
  onClick,
  expanded,
}) => {
  const style = textStyle();
  return (
    <div>
      <Tooltip title="View Interface">
        <IconButton
          aria-label="View Interface"
          color="primary"
          onClick={onClick}
        >
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export { VisibilityButton };
