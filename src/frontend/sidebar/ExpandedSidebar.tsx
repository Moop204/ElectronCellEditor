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
}) => {
  return (
    <Grid item xs={3}>
      <OptionWidget
        content={content}
        switchSidebar={switchSidebar}
        switchView={switchView}
        viewSidebar={viewSidebar}
        view={view}
      />

      <PropertiesWidget />
      <IssuesWidget expanded={viewSidebar} />
    </Grid>
  );
};

export { ExpandedSidebar };