import React, { FunctionComponent } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { TextViewButton } from "./TextViewButton";
import { SpatialViewButton } from "./SpatialViewButton";
import { VisibilityButton } from "./VisibilityButton";
import { ISidebar } from "../ISidebar";
import { SaveButton } from "./SaveButton";

const localStyles = makeStyles(() =>
  createStyles({
    optionText: {
      color: "black",
      paddingLeft: "1vh",
    },
  })
);

const VerticalOptionWidget: FunctionComponent<ISidebar> = ({
  content,
  baseContent,
  updateBaseContent,
  switchSidebar,
  switchView,
  view,
  valid,
}) => {
  const style = localStyles();
  console.log(baseContent);
  console.log(content);
  return (
    <Paper
      style={{
        height: "40%",
        color: "#353433",
      }}
    >
      <Grid
        container
        item
        direction="row"
        justify="space-around"
        style={{ height: "95%" }}
      >
        <Grid container item>
          <Typography variant="h6" style={{ paddingLeft: "5px" }}>
            Views
          </Typography>
        </Grid>

        {view && (
          <Grid item container direction="row" justify="center" xs={12}>
            <TextViewButton onClick={switchView} expanded={false} />
          </Grid>
        )}
        {!view && (
          <Grid item container direction="row" justify="center" xs={12}>
            <SpatialViewButton onClick={switchView} expanded={false} />
          </Grid>
        )}
        <Grid item container direction="row" justify="center" xs={12}>
          <VisibilityButton onClick={switchSidebar} expanded={false} />
        </Grid>
        <Grid item container direction="row" justify="center" xs={12}>
          <SaveButton
            content={content}
            expanded={false}
            color={baseContent === content ? "primary" : "secondary"}
            updateBaseContent={updateBaseContent}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export { VerticalOptionWidget };
