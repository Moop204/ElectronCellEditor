import React, { FunctionComponent } from "react";
import { Grid, IconButton, Paper, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { TextViewButton } from "./TextViewButton";
import { SpatialViewButton } from "./SpatialViewButton";
import { VisibilityButton } from "./VisibilityButton";
import { ISidebar } from "../ISidebar";
import { SaveButton } from "./SaveButton";
import NoteAddIcon from "@material-ui/icons/NoteAdd";

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
        direction="row"
        justifyContent="space-around"
        style={{ height: "95%" }}
      >
        {view && (
          <Grid item container direction="row" justifyContent="center" xs={12}>
            <TextViewButton onClick={switchView} expanded={false} />
          </Grid>
        )}
        {!view && (
          <Grid item container direction="row" justifyContent="center" xs={12}>
            <SpatialViewButton onClick={switchView} expanded={false} />
          </Grid>
        )}
        <Grid item container direction="row" justifyContent="center" xs={12}>
          <VisibilityButton onClick={switchSidebar} expanded={false} />
        </Grid>
        <Grid item container direction="row" justifyContent="center" xs={12}>
          <SaveButton
            content={content}
            expanded={false}
            color={baseContent === content ? "primary" : "secondary"}
            updateBaseContent={updateBaseContent}
          />
        </Grid>
        <Grid item>
          <IconButton onClick={() => window.api.send("new-file")}>
            <NoteAddIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { VerticalOptionWidget };
