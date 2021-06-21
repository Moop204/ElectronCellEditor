import { makeStyles, createStyles, Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { IssueProp } from "./IssueProp";

const useStyle = makeStyles(() =>
  createStyles({
    errorMarker: {
      color: "red",
    },
    markerPadding: {
      paddingRight: "2vh",
    },
    plainText: {
      color: "black",
    },
  })
);

const ErrorComponent: FunctionComponent<IssueProp> = ({ desc }) => {
  const style = useStyle();
  return (
    <span>
      <Typography variant="body1" style={{ paddingLeft: "5px" }}>
        <span className={[style.errorMarker, style.markerPadding].join(" ")}>
          {">>>"}
        </span>
        {desc}
      </Typography>
    </span>
  );
};

export { ErrorComponent };
