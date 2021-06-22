import { Grid } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { VerticalOptionWidget } from "./component/VerticalOptionWidget";
import { ISidebar } from "./ISidebar";
import { IssuesWidget } from "./issues/IssueWidget";

const UnexpandedSidebar: FunctionComponent<ISidebar> = ({
  content,
  switchSidebar,
  switchView,
  viewSidebar,
  view,
}) => {
  return (
    <Grid item xs={1}>
      <VerticalOptionWidget
        content={content}
        switchSidebar={switchSidebar}
        switchView={switchView}
        viewSidebar={viewSidebar}
        view={view}
      />
      <IssuesWidget expanded={viewSidebar} />
    </Grid>
  );
};

export { UnexpandedSidebar };
