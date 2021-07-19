import {
  createStyles,
  DialogContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import React, { useState, FunctionComponent } from "react";
import { UnitDescriptor } from "../../../types/UnitDescriptor";
import MathJax from "mathjax3-react";
import { Elements } from "../../../types/Elements";
import { UnitEditForm } from "./addChildren/form/UnitEditForm";
import { ElementHelp } from "../help/ElementHelp";
import { DeleteButton } from "./children/DeleteButton";
import { Description } from "@material-ui/icons";

interface IUnitForm {
  parentName: string;
  units: {
    description: UnitDescriptor;
    index: number;
  }[];
}

const useStyle = makeStyles(() =>
  createStyles({
    buffer: {
      padding: "3vh",
    },
  })
);

interface IUnitMath {
  description: UnitDescriptor;
  parentName: string;
  index: number;
  onClick: () => void;
}

const UnitMath: FunctionComponent<IUnitMath> = ({
  description: { prefix, reference, exponent, multiplier, imported },
  onClick,
  parentName,
  index,
}) => {
  return (
    <Grid container style={{ width: "100%" }}>
      <Grid item xs={1}>
        {imported && "I"}
      </Grid>
      <Grid item xs={10} onClick={onClick}>
        <MathJax.Formula
          formula={`$$ ${
            multiplier !== 1 ? multiplier.toString() + "*" : ""
          }${prefix}${
            reference.length > 30 ? reference.substr(0, 27) + "..." : reference
          }^{${exponent !== 1 ? exponent : ""}} $$`}
        />
      </Grid>
      <Grid item xs={1}>
        <DeleteButton
          elementType={Elements.unit}
          name={parentName}
          index={index}
        />
      </Grid>
    </Grid>
  );
};

const UnitHeading = () => {
  return (
    <Grid container item direction="row">
      <Grid item xs={9} style={{ backgroundColor: "#236" }}>
        <Typography variant="h4" style={{ paddingLeft: "5px" }}>
          Edit Unit
        </Typography>
      </Grid>
      <Grid item xs={3} style={{ backgroundColor: "#712" }}>
        {/* <ElementHelp type={Elements.unit} /> */}X{" "}
      </Grid>
    </Grid>
  );
};

const UnitEdit = ({ units, parentName }: IUnitForm) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = useStyle();
  return (
    <Grid item container xs={12}>
      <MathJax.Provider>
        {units.map((description, index) => {
          return (
            <div>
              <div style={{ width: "100%" }}>
                <UnitMath
                  description={description.description}
                  onClick={handleClickOpen}
                  parentName={parentName}
                  index={index}
                />
              </div>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                  <UnitHeading />
                </DialogTitle>
                <div className={style.buffer}>
                  <UnitEditForm
                    parentName={parentName}
                    handleClose={handleClose}
                    unit={description.description}
                    parent={Elements.units}
                    index={index}
                  />
                </div>
              </Dialog>
            </div>
          );
        })}
      </MathJax.Provider>
    </Grid>
  );
};

interface IUnitWidget {
  unitMap: {
    description: UnitDescriptor;
    index: number;
  }[];
  parentName: string;
}

const UnitWidget: FunctionComponent<IUnitWidget> = ({
  unitMap,
  parentName,
}) => {
  return (
    <Grid item container xs={11}>
      {unitMap.length > 0 && (
        <Grid item xs={12}>
          <Grid item xs={10}>
            <Typography variant="h5" style={{ paddingLeft: "5px" }}>
              Unit
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <ElementHelp type={Elements.unit} />
          </Grid>
        </Grid>
      )}
      <UnitEdit units={unitMap} parentName={parentName} />
    </Grid>
  );
};

export { UnitWidget, IUnitForm };
