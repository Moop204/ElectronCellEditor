import { makeStyles, createStyles, Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { IssueProp } from "./IssueProp";

const useStyle = makeStyles(() =>
  createStyles({
    warningMarker: {
      color: "orange",
    },
    markerPadding: {
      paddingRight: "2vh",
    },
    plainText: {
      color: "black",
    },
  })
);

const WarningComponent: FunctionComponent<IssueProp> = ({ desc }) => {
  const style = useStyle();
  return (
    <span>
      <Typography variant="body1" style={{ paddingLeft: "5px" }}>
        <span className={[style.warningMarker, style.markerPadding].join(" ")}>
          {">>>"}
        </span>
        {desc}
      </Typography>
    </span>
  );
};

export { WarningComponent };
