import { Tooltip, IconButton, Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { Save as SaveIcon } from "@material-ui/icons";
import { textStyle } from "./textStyle";

interface ISaveButton {
  content: string;
  expanded: boolean;
  color: "primary" | "secondary";
  updateBaseContent: (content: string) => void;
}

const SaveButton: FunctionComponent<ISaveButton> = ({
  content,
  expanded,
  color,
  updateBaseContent,
}) => {
  const style = textStyle();

  return (
    <div>
      <Tooltip title="Save">
        <IconButton
          aria-label="Save Action"
          color={color}
          onClick={() => {
            window.api.send("save-content", content);
            updateBaseContent(content);
          }}
        >
          <SaveIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export { SaveButton };
