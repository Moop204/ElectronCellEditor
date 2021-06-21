import { DialogContent, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import React, { useState, FunctionComponent } from "react";
import { UnitDescriptor } from "../../../types/UnitDescriptor";

interface IUnitForm {
  unit: UnitDescriptor;
}

const UnitEditForm = ({ unit }: IUnitForm) => {
  const { reference, prefix, exponent, multiplier, imported } = unit;
  console.log(prefix);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Grid item container xs={12}>
      <Button fullWidth onClick={handleClickOpen}>
        <Grid item xs={3}>
          {prefix}
          {reference}
        </Grid>
        <Grid item xs={4}>
          Exponent: {exponent}
        </Grid>
        <Grid item xs={4}>
          Multiplier: {multiplier}
        </Grid>
        <Grid item xs={1}>
          {imported && "I"}
        </Grid>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Unit</DialogTitle>
        <DialogContent>A</DialogContent>
      </Dialog>
    </Grid>
  );
};

interface IUnitWidget {
  unitMap: {
    description: UnitDescriptor;
    index: number;
  }[];
}

const UnitWidget: FunctionComponent<IUnitWidget> = ({ unitMap }) => {
  console.log(unitMap);
  return (
    <Grid item container xs={12}>
      <Grid item xs={12}>
        {unitMap.length > 0 && (
          <Typography variant="h5" style={{ paddingLeft: "5px" }}>
            Unit
          </Typography>
        )}
      </Grid>
      {unitMap.map((unit) => (
        <UnitEditForm unit={unit.description} />
      ))}
    </Grid>
  );
};

export { UnitWidget };
