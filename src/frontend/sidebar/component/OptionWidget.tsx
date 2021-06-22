import * as React from "react";
import Grid from "@material-ui/core/Grid";
import { Heading } from "../../component/Heading";
import { TextViewButton } from "./TextViewButton";
import { SpatialViewButton } from "./SpatialViewButton";
import { VisibilityButton } from "./VisibilityButton";
import { UndoButton } from "./UndoButton";
import { RedoButton } from "./RedoButton";
import SaveIcon from "@material-ui/icons/Save";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { useState, useEffect } from "react";
import { IOptionButtonProp } from "./IOptionButtonProp";
import { Paper } from "@material-ui/core";

const OptionWidget: React.FunctionComponent<IOptionButtonProp> = ({
  content,
  switchSidebar,
  switchView,
}) => {
  const [baseContent, setBaseContent] = useState("");
  useEffect(() => {
    setBaseContent(content);
  }, []);

  return (
    <Grid container item xs={12}>
      <Paper>
        <Grid container item xs={12}>
          <Grid item xs={2}>
            <TextViewButton onClick={switchView} />
          </Grid>
          <Grid item xs={2}>
            <SpatialViewButton onClick={switchView} />
          </Grid>
          <Grid item xs={2}>
            <VisibilityButton onClick={switchSidebar} />
          </Grid>
          <Grid item xs={2}>
            <UndoButton />
          </Grid>
          <Grid item xs={2}>
            <RedoButton />
          </Grid>
          <Grid item xs={2}>
            <Tooltip title="Redo">
              <IconButton
                aria-label="Redo Action"
                color={baseContent === content ? "primary" : "secondary"}
                onClick={() => {
                  window.api.send("save-content", content);
                  setBaseContent(content);
                }}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export { OptionWidget };
