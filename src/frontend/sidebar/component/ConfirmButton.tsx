import { Button } from "@material-ui/core";
import React, { FunctionComponent, MouseEventHandler, useState } from "react";

interface IConfirmButton {
  accept: MouseEventHandler<HTMLButtonElement>;
  text: string;
}
const ConfirmButton: FunctionComponent<IConfirmButton> = ({ accept, text }) => {
  return (
    <Button
      color="primary"
      variant="contained"
      fullWidth
      type="submit"
      // onClick={accept}
    >
      {text}
    </Button>
  );
};

export { ConfirmButton };
