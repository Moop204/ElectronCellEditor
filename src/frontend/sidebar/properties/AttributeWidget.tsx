import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, { FunctionComponent } from "react";
import PropertyAttribute from "./PropertyAttribute";

interface IAttributeWidget {
  handleChange: (attrType: string, attrVal: string) => void;
  attribute: Record<string, string>;
}

const AttributeWidget: FunctionComponent<IAttributeWidget> = ({
  handleChange,
  attribute,
}) => {
  return (
    <Grid item xs={12}>
      <Typography variant="h5" style={{ paddingLeft: "5px" }}>
        Attributes
      </Typography>
      {Object.entries(attribute).map(([attrTitle, attrVal]) => (
        <PropertyAttribute
          title={attrTitle}
          value={attrVal}
          key={attrTitle}
          // onChange={(e) => handleChange(attrTitle, e.target.value)}
          onChange={handleChange}
        />
      ))}
    </Grid>
  );
};

export { AttributeWidget };
