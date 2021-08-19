import * as React from "react";
import Grid from "@material-ui/core/Grid";
import { TextViewButton } from "./TextViewButton";
import { SpatialViewButton } from "./SpatialViewButton";
import { VisibilityButton } from "./VisibilityButton";
import { useState, useEffect } from "react";
import { IOptionButtonProp } from "./IOptionButtonProp";
import {
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
} from "@material-ui/core";
import { SaveButton } from "./SaveButton";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ISidebar } from "../ISidebar";
import { SearchElement } from "./search/SearchElement";
import SearchIcon from "@material-ui/icons/Search";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import { NewFileButton } from "./NewFileButton";

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
    <Grid
      container
      item
      xs={12}
      direction="row"
      justifyContent="space-around"
      className={style.options}
    >
      {view && (
        <Grid item>
          <TextViewButton onClick={switchView} expanded={true} />
        </Grid>
      )}
      {!view && (
        <Grid item>
          <SpatialViewButton
            onClick={() => {
              switchView();
              window.api.send("update-content", content);
              window.api.send("get-element");
            }}
            expanded={true}
          />
        </Grid>
      )}
      <Grid item>
        <VisibilityButton
          onClick={() => {
            switchSidebar();
            window.api.send("validate-file", content);
          }}
          expanded={true}
        />
      </Grid>
      <Grid item>
        <SaveButton
          color={"primary"} //{baseContent === content ? "primary" : "secondary"}
          expanded={true}
          content={content}
          updateBaseContent={updateBaseContent}
        />
      </Grid>
      {/* <Grid item xs={2}>
          <IconButton color="primary" onClick={() => setElementSearch(true)}>
            <SearchIcon />
          </IconButton>
        </Grid> */}
      <Grid item>
        <NewFileButton />
      </Grid>
      <Dialog
        open={elementSearch}
        onClose={() => setElementSearch(false)}
        fullWidth
        maxWidth="xl"
      >
        <DialogContent>
          <SearchElement />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export { OptionWidget };
