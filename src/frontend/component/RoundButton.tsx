import { makeStyles, createStyles } from "@material-ui/core";
import React, { forwardRef } from "react";
import { FunctionComponent } from "react";

const useStyle = makeStyles(() =>
  createStyles({
    roundButton: {
      borderRadius: "25px",
      border: "2px solid #000000",
      marginBottom: "4px",
    },
  })
);

// const RoundButton = forwardRef((props, ref) => {
//   const style = useStyle();
//   return <div className={style.roundButton}>{props.children}</div>;
// });

const RoundButton: FunctionComponent = (props) => {
  const style = useStyle();
  return <div className={style.roundButton}>{props.children}</div>;
};

export { RoundButton };
