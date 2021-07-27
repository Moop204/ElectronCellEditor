import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Link,
} from "@material-ui/core";
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

const HintComponent: FunctionComponent<IssueProp> = ({
  desc,
  section,
  url,
}) => {
  const style = useStyle();
  return (
    <span>
      <Typography variant="body1" style={{ paddingLeft: "5px" }}>
        <span className={[style.hintMarker, style.markerPadding].join(" ")}>
          {`>>> `}
        </span>
        {`Hint: ${desc}
Refer to section `}{" "}
        <Link href="#" onClick={() => window.open(url)}>
          {section}
        </Link>
      </Typography>
    </span>
  );
};

export { HintComponent };
