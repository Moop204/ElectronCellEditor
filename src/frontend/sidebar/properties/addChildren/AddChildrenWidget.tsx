import React, { FunctionComponent } from "react";
import { Elements, elmToStr } from "../../../../types/Elements";
import { AddChildSelect } from "./AddChildSelect";
import Grid from "@material-ui/core/Grid";
import { Paper, Typography } from "@material-ui/core";

const AddChild = (childElm: Elements, parent: Elements, parentName: string) => {
  return (
    <Grid item xs={12} key={parentName + elmToStr(childElm)}>
      <AddChildSelect
        childElement={childElm}
        parentElement={parent}
        parentName={parentName}
        key={elmToStr(childElm)}
      />
    </Grid>
  );
};

interface IAddChild {
  element: Elements;
  name: string;
}

const AddChildrenWidget: FunctionComponent<IAddChild> = ({ element, name }) => {
  let children = [];
  switch (element) {
    case Elements.model:
      children = [Elements.component, Elements.units];
      break;
    case Elements.component:
      children = [Elements.reset, Elements.variable, Elements.component];
      break;
    case Elements.units:
      children = [Elements.unit];
      break;
    default:
      return <div></div>;
  }
  return (
    <Grid item xs={12}>
      <Paper style={{ height: "100%" }}>
        {children.length > 0 && (
          <Typography variant="h4" style={{ paddingLeft: "5px" }}>
            Add Children
          </Typography>
        )}
        {children.map((elm) => {
          return AddChild(elm, element, name);
        })}
      </Paper>
    </Grid>
  );
};

export { AddChildrenWidget };
