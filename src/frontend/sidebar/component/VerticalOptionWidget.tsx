import React, { FunctionComponent } from "react";
import { Save as SaveIcon } from "@material-ui/icons";
import {
  Grid,
  Tooltip,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { TextViewButton } from "./TextViewButton";
import { SpatialViewButton } from "./SpatialViewButton";
import { VisibilityButton } from "./VisibilityButton";
import { ISidebar } from "../ISidebar";

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
  switchSidebar,
  switchView,
  view,
}) => {
  const style = localStyles();
  return (
    <Paper
      style={{
        height: "30%",
        color: "#353433",
      }}
    >
      <Grid
        container
        item
        direction="column"
        justify="space-around"
        style={{ height: "95%" }}
      >
        <Typography variant="h4" style={{ paddingLeft: "5px" }}>
          Views
        </Typography>

        {view && (
          <Grid item>
            <TextViewButton onClick={switchView} />
            <span className={style.optionText}>
              <Typography variant="button"> Raw </Typography>
            </span>
          </Grid>
        )}
        {!view && (
          <Grid item>
            <SpatialViewButton onClick={switchView} />
            <span className={style.optionText}>
              <Typography variant="button">Concise</Typography>
            </span>
          </Grid>
        )}
        <Grid item>
          <VisibilityButton onClick={switchSidebar} />
          <span className={style.optionText}>
            <Typography variant="button">Expand</Typography>
          </span>
        </Grid>
        <Grid item>
          <Tooltip title="Save">
            <IconButton
              aria-label="Save Action"
              color="primary"
              onClick={() => {
                window.api.send("save-content", content);
              }}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <span className={style.optionText}>
            <Typography variant="button">Save</Typography>
          </span>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { VerticalOptionWidget };
