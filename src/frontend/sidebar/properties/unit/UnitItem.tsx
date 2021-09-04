import {
  ListItem,
  Dialog,
  DialogTitle,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import React, { FunctionComponent, useState } from "react";
import { Elements } from "../../../../types/Elements";
import { UnitDescriptor } from "../../../../types/UnitDescriptor";
import { UnitEditForm } from "../addChildren/form/UnitEditForm";
import { UnitHeading } from "./UnitHeading";
import { UnitMath } from "./UnitMath";

const useStyle = makeStyles(() =>
  createStyles({
    buffer: {
      padding: "3vh",
    },
  })
);

interface IUnitItem {
  description: UnitDescriptor;
  parentName: string;
  index: number;
}
const UnitItem: FunctionComponent<IUnitItem> = ({
  description,
  parentName,
  index,
}) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = useStyle();
  return (
    <ListItem button>
      <div style={{ width: "100%" }}>
        <UnitMath
          description={description}
          onClick={handleClickOpen}
          parentName={parentName}
          index={index}
        />
      </div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>
          <UnitHeading />
        </DialogTitle>
        <div className={style.buffer}>
          <UnitEditForm
            parentName={parentName}
            handleClose={handleClose}
            unit={description}
            parent={Elements.units}
            index={index}
          />
        </div>
      </Dialog>
    </ListItem>
  );
};

export { UnitItem };
