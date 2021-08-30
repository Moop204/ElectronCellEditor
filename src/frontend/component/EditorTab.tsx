import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Tooltip from "@material-ui/core/Tooltip";
import React, { FunctionComponent } from "react";

interface IEditorTab {
  fileName: string;
}

const EditorTab: FunctionComponent<IEditorTab> = ({ fileName }) => {
  return (
    <AppBar position="static" color="default">
      <Tabs
        value={fileName}
        // onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="file tabs"
      >
        <Tooltip title={fileName}>
          <Tab
            style={{
              textOverflow: "ellipsis",
              textTransform: "none",
              textDecoration: "underline",
            }}
            wrapped
            label={
              fileName[0] !== "/"
                ? fileName === ""
                  ? "untitled"
                  : fileName
                : fileName.match(/\/[^/]+$/)[0].slice(1)
            }
          />
        </Tooltip>
      </Tabs>
    </AppBar>
  );
};

export { EditorTab }