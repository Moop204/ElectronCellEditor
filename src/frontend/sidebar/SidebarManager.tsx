import React, { FunctionComponent, useEffect } from "react";
import { ExpandedSidebar } from "./ExpandedSidebar";
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
  useEffect(() => {
    window.api.send("validate-file", content);
  }, []);

  if (viewSidebar) {
    return (
      <ExpandedSidebar
        content={content}
        switchSidebar={switchSidebar}
        switchView={switchView}
        viewSidebar={viewSidebar}
        view={view}
        valid={valid}
        updateBaseContent={setBaseContent}
      />
    );
  } else {
    return (
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
    );
  }
};

export { SidebarManager };
