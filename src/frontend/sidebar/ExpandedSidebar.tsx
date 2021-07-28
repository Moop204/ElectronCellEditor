import { Grid } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { OptionWidget } from "./component/OptionWidget";
import { ISidebar } from "./ISidebar";
import { IssuesWidget } from "./issues/IssueWidget";
import { PropertiesWidget } from "./properties/PropertiesWidget";

const ExpandedSidebar: FunctionComponent<ISidebar> = ({
  content,
  switchSidebar,
  switchView,
  viewSidebar,
  view,
  valid,
  updateBaseContent,
}) => {
  return (
    <div style={{ backgroundColor: "#fff" }}>
      <OptionWidget
        content={content}
        switchSidebar={switchSidebar}
        switchView={switchView}
        viewSidebar={viewSidebar}
        view={view}
        valid={valid}
        updateBaseContent={updateBaseContent}
      />
      {view && valid ? <PropertiesWidget /> : <IssuesWidget expanded={true} />}
    </div>
  );
};

export { ExpandedSidebar };
