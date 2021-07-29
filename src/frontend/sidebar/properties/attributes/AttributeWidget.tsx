import {
  Button,
  createStyles,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, { FunctionComponent, useState } from "react";
import { PropertyAttribute } from "./PropertyAttribute";

interface IAttributeWidget {
  handleChange: (attrType: string, attrVal: string, index: number) => void;
  attribute: Record<string, string>;
  updateAttribute: any;
}

const useStyle = makeStyles(() =>
  createStyles({
    updateButton: {
      marginTop: "0.5vh",
    },
  })
);

const AttributeWidget: FunctionComponent<IAttributeWidget> = ({
  handleChange,
  attribute,
  updateAttribute,
}) => {
  const styles = useStyle();
  return (
    <Grid item xs={12}>
      <Typography variant="h4" style={{ paddingLeft: "5px" }}>
        Attributes
      </Typography>
      {Object.entries(attribute).map(([attrTitle, attrVal], idx) => (
        <PropertyAttribute
          title={attrTitle}
          value={attrVal}
          key={attrTitle}
          index={idx}
          // onChange={(e) => handleChange(attrTitle, e.target.value)}
          onChange={handleChange}
        />
      ))}
      <Button
        variant="outlined"
        onClick={updateAttribute}
        fullWidth
        className={styles.updateButton}
      >
        Update Attribute
      </Button>
    </Grid>
  );
};

export { AttributeWidget };
