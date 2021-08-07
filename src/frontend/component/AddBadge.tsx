import { Badge } from "@material-ui/core";
import React, { FunctionComponent } from "react";

const AddBadge: FunctionComponent = (props) => {
  return (
    <Badge
      color="error"
      style={{ backgroundColor: "" }}
      overlap="circular"
      badgeContent="+"
    >
      {props.children}
    </Badge>
  );
};

export { AddBadge };
