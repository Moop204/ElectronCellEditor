import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useState } from 'react';
import IPropertyAttribute from '../../../types/IPropertyAttribute';
import { PresentationMath } from '../../components/math/Math';
import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { EditorMonaco } from '../contentView/rawView/EditorMonaco';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    mathEdit: {
      width: '80vw',
    },
    contentEdit: {
      width: '100%',
    },
  })
);

const isMathAttribute = (attr: string) => {
  switch (attr) {
    case 'math':
    case 'test_value':
    case 'reset_value':
      return true;
    default:
      return false;
  }
};

const isMath = (title: string, value: string, mathSelect: boolean) => {
  let valid = false;
  // Allowed title
  if (title === 'math') {
    valid = true && mathSelect;
  }

  // Empty values
  if (value === '') {
    valid = false;
  }
  console.log('Valid');
  console.log(valid);
  return valid;
};

const PropertyAttribute = (props: IPropertyAttribute) => {
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
          <div>
            <InputLabel>{title}</InputLabel>
            <TextField
              value={value}
              onChange={(e) => onChange(title, e.target.value)}
              rows={mathSelect ? 5 : 1}
            />
          </div>
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
