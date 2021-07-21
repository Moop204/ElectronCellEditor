import {
  Dialog,
  DialogTitle,
  Grid,
  Button,
  DialogContent,
} from "@material-ui/core";
import React, { FunctionComponent, useState } from "react";
import { EditorMonaco } from "../../../editor/raw/EditorMonaco";
import { Elements } from "../../../../types/Elements";
import { ElementHelp } from "../../help/ElementHelp";

interface IMathDialog {
  open: boolean;
  handleClose: () => void;
  value: string;
  updateDetail: any;
  title: string;
  index: number;
}

const EditMathDialog: FunctionComponent<IMathDialog> = ({
  open,
  handleClose,
  updateDetail,
  value,
  title,
  index,
}) => {
  const [content, setContent] = useState(value);
  const handleSavedClose = () => {
    updateDetail(title, content, index);
    handleClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleSavedClose}
      aria-labelledby="form-dialog-title"
      // className={style.contentEdit}
      fullWidth
    >
      <DialogTitle id="form-dialog-title">
        <Grid container>
          <Grid container item xs={10} direction="row">
            Edit MathML
            <ElementHelp type={Elements.math} />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={handleSavedClose} color="primary">
              Close
            </Button>
          </Grid>
        </Grid>
      </DialogTitle>
      {/* <DialogContent className={style.mathEdit}> */}
      <DialogContent>
        <Grid container item>
          <EditorMonaco
            xmlInput={value}
            onChange={(val: string) => {
              setContent(val);
            }}
          />
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export { EditMathDialog };
