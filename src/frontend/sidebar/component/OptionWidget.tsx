import * as React from "react";
import Grid from "@material-ui/core/Grid";
import { TextViewButton } from "./TextViewButton";
import { SpatialViewButton } from "./SpatialViewButton";
import { VisibilityButton } from "./VisibilityButton";
import { useState, useEffect } from "react";
import { IOptionButtonProp } from "./IOptionButtonProp";
import { Paper } from "@material-ui/core";
import { SaveButton } from "./SaveButton";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ISidebar } from "../ISidebar";

const useStyle = makeStyles(() =>
  createStyles({
    padding: {
      padding: "0px",
    },
  })
);

const OptionWidget: React.FunctionComponent<ISidebar> = ({
  content,
  switchSidebar,
  switchView,
  view,
  valid,
}) => {
  const style = useStyle();
  const [baseContent, setBaseContent] = useState("");
  useEffect(() => {
    setBaseContent(content);
  }, []);

  return (
    <Grid container item xs={12} className={style.padding}>
      <Paper style={{ width: "100%" }}>
        <Grid container item xs={12}>
          {view && (
            <Grid item xs={2}>
              <TextViewButton onClick={switchView} expanded={true} />
            </Grid>
          )}
          {!view && (
            <Grid item xs={2}>
              <SpatialViewButton onClick={switchView} expanded={true} />
            </Grid>
          )}
          <Grid item xs={2}>
            <VisibilityButton onClick={switchSidebar} expanded={true} />
          </Grid>
          <Grid item xs={2}>
            <SaveButton
              color={baseContent === content ? "primary" : "secondary"}
              expanded={true}
              content={content}
            />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export { OptionWidget };
