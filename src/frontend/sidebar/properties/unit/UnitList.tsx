import { List, ListItem } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { IUnitForm } from "../../../../types/IUnitForm";
import { Elements } from "../../../../types/Elements";
import { AddChildSelect } from "../addChildren/AddChildSelect";
import { UnitItem } from "./UnitItem";

const UnitList: FunctionComponent<IUnitForm> = ({ units, parentName }) => {
  return (
    <List>
      {units.map((description, index) => {
        return (
          <UnitItem
            description={description.description}
            index={index}
            parentName={parentName}
          />
        );
      })}
      <ListItem>
        <div style={{ width: "100%" }}>
          <AddChildSelect
            childElement={Elements.unit}
            parentElement={Elements.units}
            parentName={parentName}
          />
        </div>
      </ListItem>
    </List>
  );
};

export { UnitList };
