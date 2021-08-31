import { DialogActions } from "@material-ui/core";
import { CloseButton } from "../../../component/CloseButton";
import { ConfirmButton } from "../../../component/ConfirmButton";
import React, { FunctionComponent, MouseEventHandler } from "react";

interface IFormAction {
  close: MouseEventHandler<HTMLButtonElement>;
  accept?: MouseEventHandler<HTMLButtonElement>;
  acceptText: string;
}
const FormAction: FunctionComponent<IFormAction> = ({
  close,
  accept,
  acceptText,
}) => {
  return (
    <DialogActions>
      <CloseButton close={close} />
      <ConfirmButton accept={accept} text={acceptText} />
    </DialogActions>
  );
};

export { FormAction };
