import { Grid, Button } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { ExpandedSidebar } from "./ExpandedSidebar";
import { AddChildrenWidget } from "./properties/addChildren/AddChildrenWidget";
import { AttributeWidget } from "./properties/AttributeWidget";
import { ChildrenWidget } from "./properties/children/ChildrenWidget";
import { UnitWidget } from "./properties/UnitWidget";
import { UnexpandedSidebar } from "./UnexpandedSidebar";

interface ISidebarManager {
  viewSidebar: boolean;
  view: boolean;
  valid: boolean;
  content: string;
  baseContent: string;
  setBaseContent: (content: string) => void;
  switchSidebar: () => void;
  switchView: () => void;
}

const SidebarManager: FunctionComponent<ISidebarManager> = ({
  viewSidebar,
  content,
  setBaseContent,
  view,
  valid,
  baseContent,
  switchSidebar,
  switchView,
}) => {
  return (
    <div>
      {viewSidebar && (
        <ExpandedSidebar
          content={content}
          switchSidebar={switchSidebar}
          switchView={switchView}
          viewSidebar={viewSidebar}
          view={view}
          valid={valid}
          updateBaseContent={setBaseContent}
        />
      )}
      {!viewSidebar && (
        <UnexpandedSidebar
          content={content}
          baseContent={baseContent}
          switchSidebar={switchSidebar}
          switchView={switchView}
          viewSidebar={viewSidebar}
          view={view}
          valid={valid}
          updateBaseContent={setBaseContent}
        />
      )}
    </div>
  );
};

export { SidebarManager };
