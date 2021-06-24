import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import React, { useState, FunctionComponent } from "react";
import IPropertyAttribute from "../../../types/IPropertyAttribute";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { EditorMonaco } from "../../editor/raw/EditorMonaco";
import { PresentationMath } from "../math/PresentationMath";

const useStyle = makeStyles(() =>
  createStyles({
    mathEdit: {
      width: "80vw",
    },
    contentEdit: {
      width: "100%",
    },
  })
);

const isMathAttribute = (attr: string) => {
  switch (attr) {
    case "math":
    case "test_value":
    case "reset_value":
      return true;
    default:
      return false;
  }
};

const PropertyAttribute: FunctionComponent<IPropertyAttribute> = (props) => {
  const { title, value, onChange } = props;
  // if (title === 'math') {
  //   return (
  //     <Grid container item direction="row">
  //       <InputLabel>{title}</InputLabel>
  //       <Math mathml={value} />
  //     </Grid>
  //   );
  // }
  const [mathSelect, setMathSelect] = useState(false);
  const handleClose = () => {
    setMathSelect(false);
    console.log(`Setting false: ${mathSelect}`);
  };
  const handleOpen = () => {
    setMathSelect(true);
    console.log(`Setting true: ${mathSelect}`);
  };
  const style = useStyle();
  return (
    <div>
      <Grid container item direction="row">
        {!isMathAttribute(title) && (
          <Grid container item xs={12}>
            <Grid item xs={2}>
              <InputLabel>{title}</InputLabel>
            </Grid>
            <Grid item xs={10}>
              <TextField
                value={value}
                onChange={(e) => onChange(title, e.target.value)}
                rows={mathSelect ? 5 : 1}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
        {isMathAttribute(title) && (
          <Card>
            <div onClick={handleOpen}>
              {value && (
                <div>
                  <PresentationMath mathml={value} />
                </div>
              )}
              {!value && <TextField onSelect={handleOpen} />}
            </div>
            <Dialog
              open={mathSelect}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
              className={style.contentEdit}
            >
              <DialogTitle id="form-dialog-title">Edit MathML</DialogTitle>
              <DialogContent className={style.mathEdit}>
                <Grid container item xs={10}>
                  <EditorMonaco
                    xmlInput={value}
                    onChange={(val: string) => {
                      onChange(title, val);
                    }}
                  />
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        )}
      </Grid>
    </div>
  );
};

export default PropertyAttribute;
