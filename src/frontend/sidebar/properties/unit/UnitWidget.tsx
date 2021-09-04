import { List, ListItem, Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { IUnitWidget } from "../../../../types/IUnitWidget";
import { UnitList } from "./UnitList";

const UnitWidget: FunctionComponent<IUnitWidget> = ({
  unitMap,
  parentName,
}) => {
  return (
    <List>
      {unitMap.length > 0 && (
        <ListItem>
          <Typography variant="h5" style={{ paddingLeft: "5px" }}>
            Unit
          </Typography>
        </ListItem>
      )}
      <UnitList units={unitMap} parentName={parentName} />
    </List>
  );
};

export { UnitWidget };
