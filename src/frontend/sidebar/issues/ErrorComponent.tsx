import { makeStyles, createStyles, Typography, Link } from "@material-ui/core";
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

const ErrorComponent: FunctionComponent<IssueProp> = ({
  desc,
  section,
  url,
}) => {
  const style = useStyle();
  return (
    <span>
      <Typography variant="body1" style={{ paddingLeft: "5px" }}>
        <span className={[style.errorMarker, style.markerPadding].join(" ")}>
          {`>>> `}
        </span>
        {`Error: ${desc}
Refer to section `}{" "}
        <Link href="#" onClick={() => window.open(url)}>
          {section}
        </Link>
      </Typography>
    </span>
  );
};

export { ErrorComponent };
