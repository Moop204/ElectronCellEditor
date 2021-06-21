import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { IssueProp } from "./IssueProp";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    hintMarker: {
      color: "green",
    },
    markerPadding: {
      paddingRight: "2vh",
    },
    plainText: {
      color: "black",
    },
  })
);

const HintComponent: FunctionComponent<IssueProp> = ({ desc }) => {
  const style = useStyle();
  return (
    <span>
      <span className={[style.hintMarker, style.markerPadding].join(" ")}>
        {">>>"}
      </span>
      <Typography variant="body1" style={{ paddingLeft: "5px" }}>
        {desc}
      </Typography>
    </span>
  );
};

export { HintComponent };
