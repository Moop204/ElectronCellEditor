import { DialogContent, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import React, { useState, FunctionComponent } from "react";
import { UnitDescriptor } from "../../../types/UnitDescriptor";
import MathJax from "mathjax3-react";
import { Elements } from "../../../types/Elements";
import { UnitEditForm } from "./addChildren/form/UnitEditForm";

interface IUnitForm {
  parentName: string;
  unit: UnitDescriptor;
  index: number;
}

const UnitEdit = ({ unit, parentName, index }: IUnitForm) => {
  const { reference, prefix, exponent, multiplier, imported } = unit;
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Grid item container xs={12}>
      <div style={{ width: "100%" }} onClick={handleClickOpen}>
        <MathJax.Provider>
          <MathJax.Formula
            formula={`$$${
              multiplier !== 1 ? multiplier.toString() + "*" : ""
            }${prefix}${reference}^{${exponent !== 1 ? exponent : ""}}$$`}
          />
        </MathJax.Provider>
        <Grid item xs={1}>
          {imported && "I"}
        </Grid>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <UnitEditForm
          parentName={parentName}
          handleClose={handleClose}
          unit={unit}
          parent={Elements.units}
          index={index}
        />
      </Dialog>
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
    <Grid item container xs={12}>
      <Grid item xs={12}>
        {unitMap.length > 0 && (
          <Typography variant="h5" style={{ paddingLeft: "5px" }}>
            Unit
          </Typography>
        )}
      </Grid>
      {unitMap.map((unit, index) => (
        <UnitEdit
          unit={unit.description}
          index={index}
          parentName={parentName}
        />
      ))}
    </Grid>
  );
};

export { UnitWidget, IUnitForm };
