import * as React from "react";
import Grid from "@material-ui/core/Grid";
import { TextViewButton } from "./TextViewButton";
import { SpatialViewButton } from "./SpatialViewButton";
import { VisibilityButton } from "./VisibilityButton";
import { useState, useEffect } from "react";
import { IOptionButtonProp } from "./IOptionButtonProp";
import { Button, Paper } from "@material-ui/core";
import { SaveButton } from "./SaveButton";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ISidebar } from "../ISidebar";

const useStyle = makeStyles(() =>
  createStyles({
    options: {
      padding: "0px",
      height: "5vh",
    },
  })
);

const OptionWidget: React.FunctionComponent<ISidebar> = ({
  content,
  switchSidebar,
  switchView,
  view,
  valid,
  updateBaseContent,
}) => {
  const style = useStyle();
  const [baseContent, setBaseContent] = useState("");
  const [elementSearch, setElementSearch] = useState(false);
  useEffect(() => {
    setBaseContent(content);
  }, []);

  return (
    <Grid container item xs={12} className={style.options}>
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
            updateBaseContent={updateBaseContent}
          />
        </Grid>
        <Grid item xs={2}>
          <Button onClick={() => setElementSearch(true)}>FIND</Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { OptionWidget };
