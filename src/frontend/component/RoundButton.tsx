import { makeStyles, createStyles, Button } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React, { forwardRef } from "react";
import { FunctionComponent } from "react";

const useStyle = makeStyles(() =>
  createStyles({
    roundButton: {
      borderRadius: "25px",
      border: "6px solid lightgrey",
      marginBottom: "4px",
      backgroundColor: "#DCDCDC",
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
  // return (
  //   <Button disabled fullWidth style={{ backgroundColor: "#DCDCDC" }}>
  //     {props.children}
  //   </Button>
  // );
};

export { RoundButton };
