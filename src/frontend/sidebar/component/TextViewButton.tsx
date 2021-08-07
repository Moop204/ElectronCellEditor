import Tooltip from "@material-ui/core/Tooltip";
import React, { FunctionComponent } from "react";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import { Typography } from "@material-ui/core";
import { textStyle } from "./textStyle";

interface ITextViewButton {
  onClick: any;
  expanded: boolean;
}

const TextViewButton: FunctionComponent<ITextViewButton> = ({
  onClick,
  expanded,
}) => {
  const style = textStyle();
  return (
    <div>
      <Tooltip title="Text View">
        <Link to="">
          <IconButton
            name="text-view-button"
            aria-label="Text View"
            color="primary"
            onClick={onClick}
          >
            <CreateIcon />
          </IconButton>
        </Link>
      </Tooltip>
    </div>
  );
};

export { TextViewButton };
