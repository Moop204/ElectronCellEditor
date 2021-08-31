import { Button } from "@material-ui/core";
import React, { FunctionComponent, MouseEventHandler, useState } from "react";

interface ICloseButton {
  close: MouseEventHandler<HTMLButtonElement>;
}
const CloseButton: FunctionComponent<ICloseButton> = ({ close }) => {
  return (
    <Button color="primary" variant="contained" fullWidth onClick={close}>
      Cancel
    </Button>
  );
};

export { CloseButton };
