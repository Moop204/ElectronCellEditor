import { makeStyles, createStyles, Typography, Link } from "@material-ui/core";
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

const WarningComponent: FunctionComponent<IssueProp> = ({
  desc,
  section,
  url,
}) => {
  const style = useStyle();
  return (
    <span>
      <Typography variant="body1" style={{ paddingLeft: "5px" }}>
        <span className={[style.warningMarker, style.markerPadding].join(" ")}>
          {`>>> `}
        </span>
        {`Warn: ${desc}
Refer to section `}{" "}
        <Link href="#" onClick={() => window.open(url)}>
          {section}
        </Link>
      </Typography>
    </span>
  );
};

export { WarningComponent };
