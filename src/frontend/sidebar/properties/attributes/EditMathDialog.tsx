import {
  Dialog,
  DialogTitle,
  Grid,
  Button,
  DialogContent,
} from "@material-ui/core";
import React, { memo, FunctionComponent, useState, useEffect } from "react";
import { EditorMonaco } from "../../../editor/raw/EditorMonaco";
import { Elements } from "../../../../types/Elements";
import { ElementHelp } from "../../help/ElementHelp";
import { PresentationMath } from "../../math/PresentationMath";
import _ from "lodash";
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
  const [valid, setValid] = useState(true);
  const handleSavedClose = () => {
    updateDetail(title, content, index);
    handleClose();
  };
  const resetChanges = () => {
    setContent(value);
  };

  useEffect(() => {
    if (value === "") {
      setContent(`<math xmlns="http://www.w3.org/1998/Math/MathML">

</math>`);
    }
    const updateValidity = (_: Event, res: boolean) => setValid(res);
    window.api.receive("math-validity", updateValidity);

    return () => {
      window.api.remove("math-validity", updateValidity);
    };
  }, []);

  useEffect(() => {
    window.api.send("validate-math", content);
  }, [content]);

  return (
    <Dialog
      open={open}
      onClose={handleSavedClose}
      aria-labelledby="form-dialog-title"
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle id="form-dialog-title">
        <Grid container>
          <Grid container item xs={10} direction="row">
            Edit MathML
            <ElementHelp type={Elements.math} />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={resetChanges} color="primary">
              Reset
            </Button>

            <Button
              onClick={handleSavedClose}
              color="primary"
              disabled={!valid}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </DialogTitle>
      {/* <DialogContent className={style.mathEdit}> */}
      <DialogContent style={{ overflow: "hidden" }}>
        <Grid container item>
          <Grid item style={{ width: "100%", height: "70vh" }}>
            <EditorMonaco
              xmlInput={content}
              onChange={_.debounce((val: string) => {
                setContent(val);
              }, 100)}
              option={{ cellml: false, mathml: true }}
            />
          </Grid>
          <Grid
            item
            style={{ height: "30vh", width: "100%", alignSelf: "center" }}
          >
            {/* <MathComponent /> */}
            {/* <PresentationMath mathml={content} /> */}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export { EditMathDialog };
