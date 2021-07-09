import { Grid } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { VerticalOptionWidget } from "./component/VerticalOptionWidget";
import { ISidebar } from "./ISidebar";
import { IssuesWidget } from "./issues/IssueWidget";

const UnexpandedSidebar: FunctionComponent<ISidebar> = ({
  content,
  baseContent,
  switchSidebar,
  switchView,
  viewSidebar,
  view,
  valid,
  updateBaseContent,
}) => {
  return (
    <Grid item xs={1}>
      <VerticalOptionWidget
        content={content}
        baseContent={baseContent}
        switchSidebar={switchSidebar}
        switchView={switchView}
        viewSidebar={viewSidebar}
        view={view}
        valid={valid}
        updateBaseContent={updateBaseContent}
      />
      <IssuesWidget expanded={viewSidebar} />
    </Grid>
  );
};

export { UnexpandedSidebar };
