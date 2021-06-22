import React, { FunctionComponent, MouseEventHandler } from "react";
import { Elements } from "../../../../types/Elements";
import { IChild } from "../../../../types/IProperties";
import { ISearch, ISelect } from "../../../../types/IQuery";
import PropertyIcon from "./PropertyIcon";
import Grid from "@material-ui/core/Grid";
import { Divider, Typography } from "@material-ui/core";
import { capitaliseFirst } from "../../../../utility/CapitaliseFirst";

const findElement = (elm: Elements, name: string) => {
  const select: ISearch = { index: null, name };
  const query: ISelect = { element: elm, select };
  switch (elm) {
    case Elements.component:
    case Elements.units:
      window.api.send("find-element-from-children", query);
      break;
    default:
      console.log("Error: Not a valid element type");
  }
};

interface IChildrenWidget {
  abstractChildren: Record<string, IChild[]>;
  parentType: Elements;
}

const ChildrenWidget: FunctionComponent<IChildrenWidget> = ({
  abstractChildren,
  parentType,
}) => {
  if (!abstractChildren) {
    return <div></div>;
  }

  return (
    <Grid item xs={12}>
      {Object.entries(abstractChildren).length > 0 && (
        <Typography variant="h5" style={{ paddingLeft: "5px" }}>
          Children
        </Typography>
      )}

      {Object.entries(abstractChildren).map(([parentKey, childrenType]) => {
        return (
          <div key={parentKey}>
            <Divider variant="middle" />
            <Typography variant="h6" style={{ paddingLeft: "5px" }}>
              {capitaliseFirst(parentKey)}
            </Typography>
            {Object.values(childrenType).map((attrType: IChild) => {
              return (
                <PropertyIcon
                  title={attrType.name}
                  onClick={() => {
                    findElement(
                      Elements[parentKey as keyof typeof Elements],
                      attrType.name
                    );
                  }}
                  element={parentKey}
                  key={attrType.name}
                />
              );
            })}
          </div>
        );
      })}
    </Grid>
  );
};

export { ChildrenWidget };
