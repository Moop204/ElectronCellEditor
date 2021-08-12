import {
  Button,
  createStyles,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, { FunctionComponent, useState } from "react";
import { PropertyAttribute } from "./PropertyAttribute";
import { useSnackbar } from "notistack";
import { Elements, elmToStr } from "./../../../../types/Elements";
interface IAttributeWidget {
  handleChange: (attrType: string, attrVal: string, index: number) => void;
  attribute: Record<string, string>;
  updateAttribute: any;
  parentType: Elements;
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
  parentType,
}) => {
  const styles = useStyle();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const notifyUpdate = () => {
    enqueueSnackbar("Updated attributes", { variant: "info" });
  };

  return (
    <Grid item xs={12}>
      <Typography variant="h4" style={{ paddingLeft: "5px" }}>
        Attributes
      </Typography>
      {Object.entries(attribute).map(([attrTitle, attrVal], idx) => (
        <PropertyAttribute
          title={attrTitle}
          value={attrVal}
          index={idx}
          key={elmToStr(parentType) + attrTitle}
          // onChange={(e) => handleChange(attrTitle, e.target.value)}
          onChange={handleChange}
        />
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          updateAttribute();
          notifyUpdate();
        }}
        fullWidth
        className={styles.updateButton}
      >
        Update Attribute
      </Button>
    </Grid>
  );
};

export { AttributeWidget };
